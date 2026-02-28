import json
import io
import PIL.Image
import PIL.ImageDraw
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
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        image_bytes = file.read()
        image = PIL.Image.open(io.BytesIO(image_bytes))
        
        db.increment_usage(current_user['email'], 'image_count')
        
        import pytesseract
        from pytesseract import Output
        
        try:
            ocr_data = pytesseract.image_to_data(image, output_type=Output.DICT)
            full_text = " ".join([word for word in ocr_data['text'] if word.strip()])
            print(f"DEBUG: OCR extracted {len(full_text)} chars.")
        except Exception as e:
             print(f"DEBUG: OCR failed: {e}")
             return jsonify({"error": f"OCR failed: {str(e)}"}), 500

        prompt = f"""
        You are a security redaction engine.
        
        Analyze the following text extracted from an image (OCR output).
        Identify ALL sensitive information that must be redacted.
        
        TEXT TO ANALYZE:
        \"\"\"{full_text}\"\"\"
        
        SENSITIVE DATA CATEGORIES:
        - PII (Names, emails, phones, addresses)
        - Secrets (Passwords, API keys, tokens)
        - Network (IPs, internal URLs)
        - Evidence (Payloads, headers, cookies)
        
        OUTPUT FORMAT (STRICT JSON):
        Return a JSON object with a list of EXACT strings to redact found in the text.
        Do not include surrounding text.
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
            sensitive_segments = analysis.get("sensitive_segments", [])
            print(f"DEBUG: Found {len(sensitive_segments)} segments to redact.")
        except json.JSONDecodeError:
             print(f"DEBUG: JSON parse failed: {response_text}")
             return jsonify({"error": "Failed to parse AI response"}), 500

        draw = PIL.ImageDraw.Draw(image)
        width, height = image.size
        
        n_boxes = len(ocr_data['text'])
        
        def is_sensitive(word):
            if len(word) < 2: return False
            for segment in sensitive_segments:
                if word.lower() in segment.lower() or segment.lower() in word.lower():
                    return True
            return False

        for i in range(n_boxes):
            if int(ocr_data['conf'][i]) > 0:                   
                word = ocr_data['text'][i].strip()
                if not word: continue
                
                if is_sensitive(word):
                    x, y, w, h = ocr_data['left'][i], ocr_data['top'][i], ocr_data['width'][i], ocr_data['height'][i]
                    
                    pad_x = 5
                    pad_y = 5
                    
                    x = max(0, x - pad_x)
                    y = max(0, y - pad_y)
                    w = min(width - x, w + pad_x * 2)
                    h = min(height - y, h + pad_y * 2)
                    
                    draw.rectangle([x, y, x + w, y + h], fill="black")
                
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
