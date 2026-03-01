import json
import io
import PIL.Image
import PIL.ImageDraw
import PIL.ImageEnhance
import pytesseract
from pytesseract import Output
from flask import Blueprint, jsonify, request, send_file
import google.generativeai as genai
from database import db
from utils import token_required, get_ai_model, increment_user_stat

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/api/generate-report', methods=['POST'])
@token_required
def generate_report_api(current_user):
    try:
        data = request.json
        short_description = data.get('shortDescription', '')
        explanation = data.get('explanation', '')
        technical_evidence = data.get('technicalEvidenceContent', '')
        evidence_type = data.get('technicalEvidenceTab', '')

        prompt = f"""
        You are a senior penetration testing consultant and enterprise security report writer.

        Your task is to generate a professional, client-ready penetration testing vulnerability report based strictly and exclusively on the information provided by the tester.

        You must behave as a real-world security consultant preparing a formal deliverable for an enterprise client.

        INSTRUCTIONS:
        - Carefully analyze the provided logs, tester notes, and technical evidence.
        - Identify the exact vulnerability class strictly supported by the evidence (e.g., SQL Injection, Predictable Token Generation, IDOR, XSS, etc.).
        - Emphasize that this is an EXPLOIT-BASED report. You must clearly explain how the evidence translates into a real-world, actionable exploit that an attacker can execute against the company. It should not just state what the evidence is, but HOW it is weaponized.
        - Do NOT invent additional attack paths, privilege levels, lateral movement, or business impacts not directly supported by the evidence.
        - Do NOT exaggerate exploitation certainty if logs only indicate suspicious behavior.
        - If evidence suggests replay but does not cryptographically prove predictability, state this precisely, but outline how the observed replay itself constitutes an exploit.
        - Use professional security terminology aligned with OWASP, NIST, and industry penetration testing standards.
        - Maintain formal, enterprise-appropriate tone throughout.
        - Keep sections concise and proportional to real-world assessment reports.
        - Avoid redundancy between sections.

        CVSS REQUIREMENTS (CRITICAL):
        - Calculate CVSS v3.1 properly using standard FIRST CVSS methodology.
        - Explicitly reason internally about each metric before determining: Attack Vector (AV), Attack Complexity (AC), Privileges Required (PR), User Interaction (UI), Scope (S), Confidentiality (C), Integrity (I), Availability (A).
        - Scope must only be marked as Changed (S:C) if the vulnerability impacts a different security authority.
        - Do NOT default to Critical unless justified by evidence.
        - Ensure severity rating matches official CVSS 3.1 ranges: 0.1–3.9 = Low, 4.0–6.9 = Medium, 7.0–8.9 = High, 9.0–10.0 = Critical.
        - Ensure the numeric score matches the vector string exactly.

        FORMATTING RULES (MANDATORY):
        - Output must be valid JSON only.
        - Do NOT include markdown code blocks.
        - Do NOT include emojis.
        - Do NOT include commentary outside the JSON object.
        - Do NOT include trailing commas.
        - Within JSON values: Do NOT use Markdown except **bold** emphasis.
        - Use ** for section headers or key emphasis only (e.g. `**Impact:**`, `1. **Enhance Nonce Generation:**`).
        - Use \\n for line breaks. 
        - You may use numbered lists (1., 2.) and lettered sub-points (a., b.).
        - Do NOT restate the CVSS vector inside other sections.

        CONTENT DISCIPLINE:
        - EXTREMELY IMPORTANT: Ensure that the content across sections is MUTUALLY EXCLUSIVE. Do not repeat the same details, explanations, or impact statements across multiple sections. Each section must provide unique value.
        - The introduction must describe the vulnerability factually without overstating exploit success.
        - The impact section must reflect only what the evidence reasonably supports.
        - The proofOfConcept section must clearly connect evidence to the vulnerability claim.
        - The technicalDetails section must explain why the vulnerability exists based solely on supplied data.
        - If uncertainty exists in evidence, explicitly state the limitation.

        INPUT DETAILS:
        Vulnerability Title: {short_description}
        Tester Explanation / Notes: {explanation}
        Technical Evidence / Scan Output ({evidence_type}): {technical_evidence}

        REQUIRED JSON STRUCTURE:
        {{
            "title": "Refined professional vulnerability title",
            "cvssDetails": {{
                "score": "Numeric CVSS 3.1 score (e.g. 7.5)",
                "severity": "Low, Medium, High, or Critical",
                "vectorString": "CVSS:3.1/AV:X/AC:X/PR:X/UI:X/S:X/C:X/I:X/A:X"
            }},
            "introduction": "Description: Clear, precise explanation strictly supported by evidence.",
            "impact": "Impact: Technical and business impact supported by supplied information only.",
            "stepsToReproduce": ["Step 1", "Step 2", "Step 3"],
            "proofOfConcept": "Structured explanation of evidence.\\n\\n1. Main Point\\n a. Supporting detail\\n b. Supporting detail\\n2. Main Point\\n\\nExplicitly explain how the supplied logs or output demonstrate the vulnerability. If evidence is indicative but not conclusive, state that clearly.",
            "remediation": "Remediation: Clear, prioritized mitigation steps aligned with industry best practices.\\n\\nReferences:\\nRelevant OWASP or industry-standard references only if directly applicable.",
            "technicalDetails": "Explain the root cause derived strictly from supplied evidence.\\n\\nSeparate key technical factors with line breaks.\\n\\nDo not introduce speculative attack chains."
        }}

        QUALITY ENFORCEMENT:
        - The final JSON must be syntactically valid.
        - CVSS score must mathematically align with the vector.
        - Severity label must match the score range.
        - No speculative escalation beyond supplied evidence.
        - Language must reflect professional consulting standards.
        """
           
        db.increment_usage(current_user['email'], 'report_count')

        model = get_ai_model()
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        json_response = json.loads(response_text)
        return jsonify(json_response)

    except Exception as e:
        print(f"Error generating report: {e}")
        return jsonify({"error": str(e)}), 500

@ai_bp.route('/api/redact-image', methods=['POST'])
@token_required
def redact_image(current_user):
    try:
        # 1. File Handling
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        image_bytes = file.read()
        image = PIL.Image.open(io.BytesIO(image_bytes))
        
        # Wrapped in try/except to prevent database hiccups from killing the request
        try:
            db.increment_usage(current_user['email'], 'image_count')
        except Exception as db_err:
            print(f"WARNING: Could not increment usage, DB error: {db_err}")

        # 2. OCR Extraction (Optimized with Preprocessing)
        try:
            # --- PREPROCESSING START ---
            # Create a high-contrast grayscale copy just for Tesseract
            gray_image = image.convert('L')
            enhancer = PIL.ImageEnhance.Contrast(gray_image)
            contrast_image = enhancer.enhance(2.5) # Boost contrast by 250%
            # --- PREPROCESSING END ---

            custom_config = r'--oem 3 --psm 11'
            # CRITICAL: Feed 'contrast_image' to pytesseract, not 'image'
            ocr_data = pytesseract.image_to_data(contrast_image, output_type=Output.DICT, config=custom_config)
            full_text = " ".join([word for word in ocr_data['text'] if word.strip()])
            print(f"DEBUG: OCR extracted {len(full_text)} chars.")
        except Exception as e:
             print(f"DEBUG: OCR failed: {e}")
             return jsonify({"error": f"OCR failed: {str(e)}"}), 500

        # 3. LLM Prompting (Updated for BOTH Web UI and API Traffic)
        prompt = f"""
        You are a highly precise security redaction engine.
        
        Analyze the following text extracted from an image (OCR output).
        Identify ONLY the highly sensitive values that must be redacted. This image may be a web browser screenshot or an API testing tool.
        
        TEXT TO ANALYZE:
        \"\"\"{full_text}\"\"\"
        
        STRICT REDACTION RULES - REDACT THESE:
        - Target Routing: Host headers (including ports like localhost:8080 or localhost:5173), target URLs, domain names, IP addresses, and specific API endpoint paths.
        - Web Browser Data: User-generated search queries or specific interests visible in browser tabs (e.g., tab titles showing search history).
        - Specific PII: Full names, email addresses, phone numbers, physical addresses.
        - Secret values: Passwords, hashes, API keys, JWTs, Bearer tokens, Session IDs.
        
        EXCLUSIONS - DO NOT REDACT THESE:
        - Generic Web UI: Standard page text (e.g., "Welcome Back", "Sign In"), generic form labels (e.g., "STUDENT ID", "PASSWORD"), generic footers, and system/taskbar icons.
        - Standard Web/API Protocols: HTTP methods and versions (GET, POST, HTTP/1.1, 200).
        - Standard HTTP Headers & Common Values: (e.g., Date, timezones like GMT, User-Agent, Accept, Content-Type, Content-Length, Connection, Sec-Fetch-*).
        - JSON structural keys: (e.g., do not redact the word "firstName", only redact the value).
        - Standard integers, boolean values, or empty fields (e.g., id "1", semester "5", marks "100.0").
        
        OUTPUT FORMAT (STRICT JSON):
        Return a JSON object containing a list of EXACT isolated strings to redact. 
        CRITICAL: Only return the specific sensitive value. Do NOT include surrounding text or full lines. 
        {{
            "sensitive_segments": [
                "exact_string_1",
                "exact_string_2"
            ]
        }}
        """
                                      
        redaction_model = get_ai_model()
        response = redaction_model.generate_content(prompt)

        response_text = response.text.strip()
        print(f"DEBUG: Gemini Response: {response_text}")

        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        try:
            analysis = json.loads(response_text)
            raw_segments = analysis.get("sensitive_segments", [])
            sensitive_segments = [s.strip() for s in raw_segments if s.strip()]
            print(f"DEBUG: Found {len(sensitive_segments)} segments to redact.")
        except json.JSONDecodeError:
             print(f"DEBUG: JSON parse failed: {response_text}")
             return jsonify({"error": "Failed to parse AI response"}), 500

        # 4. Bounding Box Logic & Safe Matching
        width, height = image.size
        n_boxes = len(ocr_data['text'])
        
        def is_sensitive(word):
            clean_word = word.strip('",:;{}[]()\'-/|').lower()
            if len(clean_word) < 4: # Ignore tiny 1-3 letter words to prevent false positives like "to" or "vs"
                return False
                
            w_lower = word.lower()
            
            for segment in sensitive_segments:
                s_lower = segment.lower()
                clean_segment = segment.strip('",:;{}[]()\'-/|').lower()
                
                # Condition A: Exact match
                if clean_word == clean_segment:
                    return True
                    
                # Condition B: The OCR word is INSIDE the AI segment 
                # e.g., OCR is "jupyter", AI segment is "jupyter notebook" -> MATCH!
                if clean_word in clean_segment:
                    return True
                    
                # Condition C: OCR Typo Safety Net for massive secrets (Hashes, URLs)
                # e.g., OCR is "localhost:5173", AI is "5173" -> MATCH!
                if len(s_lower) > 20 and len(clean_word) >= 4 and clean_word in s_lower:
                    return True
                    
            return False

        # --- COLLECT BOXES ---
        boxes_to_draw = []
        for i in range(n_boxes):
            if int(ocr_data['conf'][i]) > 0:                   
                word = ocr_data['text'][i].strip()
                if not word: continue
                
                if is_sensitive(word):
                    x, y = ocr_data['left'][i], ocr_data['top'][i]
                    w, h = ocr_data['width'][i], ocr_data['height'][i]
                    boxes_to_draw.append({'x1': x, 'y1': y, 'x2': x + w, 'y2': y + h})

        # 5. Box Merging (Fixes the "Swiss Cheese" effect)
        merged_boxes = []
        if boxes_to_draw:
            # Sort boxes top-to-bottom, then left-to-right
            boxes_to_draw.sort(key=lambda b: (b['y1'], b['x1']))
            
            current_box = boxes_to_draw[0].copy()
            # BUMPED thresholds to ensure hashes and long URLs bridge together properly
            merge_threshold_x = 80  
            merge_threshold_y = 12  
            
            for next_box in boxes_to_draw[1:]:
                if (abs(current_box['y1'] - next_box['y1']) <= merge_threshold_y) and \
                   (next_box['x1'] - current_box['x2'] <= merge_threshold_x):
                    # Expand current box
                    current_box['x2'] = max(current_box['x2'], next_box['x2'])
                    current_box['y1'] = min(current_box['y1'], next_box['y1'])
                    current_box['y2'] = max(current_box['y2'], next_box['y2'])
                else:
                    merged_boxes.append(current_box)
                    current_box = next_box.copy()
            merged_boxes.append(current_box)

        # 6. Draw Final Redactions
        draw = PIL.ImageDraw.Draw(image)
        pad_x, pad_y = 5, 5
        
        for box in merged_boxes:
            rect_x1 = max(0, box['x1'] - pad_x)
            rect_y1 = max(0, box['y1'] - pad_y)
            rect_x2 = min(width, box['x2'] + pad_x)
            rect_y2 = min(height, box['y2'] + pad_y)

            # Check if area is already manually redacted to save processing
            try:
                region = image.crop((rect_x1, rect_y1, rect_x2, rect_y2)).convert("L")
                pixels = list(region.getdata())
                if len(pixels) > 0:
                    dark_pixels = sum(1 for p in pixels if p < 50)
                    if (dark_pixels / len(pixels)) > 0.8:
                        continue
            except Exception as e:
                print(f"DEBUG: Error checking region darkness: {e}")
            
            draw.rectangle([rect_x1, rect_y1, rect_x2, rect_y2], fill="black")
                
        # 7. Return the Processed Image
        output_buffer = io.BytesIO()
        image.save(output_buffer, format=image.format if image.format else 'PNG')
        output_buffer.seek(0)
        
        return send_file(output_buffer, mimetype=f'image/{image.format.lower() if image.format else "png"}')

    except Exception as e:
        print(f"Error redacting image: {e}")
        return jsonify({"error": str(e)}), 500

@ai_bp.route('/api/ai/test', methods=['POST'])
def test_ai_connection():
    try:
        data = request.json
        api_key = data.get('apiKey')
        model_name = data.get('model')
        
        if not api_key:
             return jsonify({"error": "API Key is required"}), 400
             
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)
        
        response = model.generate_content("hello")
        
        if response.text:
             return jsonify({"status": "success", "message": "Connection active", "response": response.text}), 200
        else:
             return jsonify({"error": "No response from model"}), 500
             
    except Exception as e:
        return jsonify({"error": str(e)}), 500
