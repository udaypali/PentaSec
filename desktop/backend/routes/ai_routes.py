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
        You are an expert penetration testing consultant and security report writer.
        Your task is to generate a professional, client-ready penetration testing vulnerability report
        based strictly on the information provided by the tester.

        INSTRUCTIONS:
        - Analyze the provided logs, explanation, and technical evidence carefully.
        - Do NOT invent vulnerabilities, attack scenarios, or impacts that are not directly supported by the provided input.
        - Use professional security terminology consistent with OWASP and industry-standard penetration testing reports.
        - If exact values such as CVSS are not provided, estimate them reasonably without explaining the estimation in the output.
        - Keep the tone formal, precise, and suitable for enterprise and client-facing security reports.
        - Keep each section concise and proportional to real-world pentest reports.

        INPUT DETAILS:
        Vulnerability Title: {short_description}
        Tester Explanation / Notes: {explanation}
        Technical Evidence / Scan Output ({evidence_type}): {technical_evidence}

        FORMATTING RULES (CRITICAL):
        - Do NOT use Markdown syntax in the JSON values.
        - Do NOT use **, *, _, #, or bullet symbols for emphasis.
        - Use newline characters (\\n) to separate distinct points and improve readability.
        - You MAY use plain text numbering (1., 2.) for lists if needed.
        - Use plain text with clear headings and colon-based emphasis.
        - Ensure the output is suitable for direct PDF export.

        OUTPUT REQUIREMENTS:
        - Generate the report as a valid JSON object with the exact keys listed below.
        - Do NOT include markdown formatting such as code blocks.
        - Do NOT include emojis or informal language.

        ===================================

        Based on the above information, generate a professional penetration testing report.
        Identify the vulnerability type from the evidence (e.g., SQL Injection, XSS, CSRF, etc.) and ensure 
        the report accurately reflects the specific vulnerability type found in the payload and evidence.

        REQUIRED JSON STRUCTURE:
        {{
            "title": "Refined professional vulnerability title",
            "cvssDetails": {{
                "score": "Numeric score (e.g. 7.5)",
                "severity": "Low, Medium, High, or Critical",
                "vectorString": "Estimated CVSS vector string"
            }},
            "introduction": "Description: Clear and factual explanation of the vulnerability.",
            "impact": "Impact: Technical and business impact based on the evidence.",
            "stepsToReproduce": ["Step 1", "Step 2", "Step 3"],
            "proofOfConcept": "Evidence Summary: Explanation referencing the provided logs or proof.",
            "remediation": "Remediation: Clear and actionable mitigation steps.\\n\\nReferences:\\nRelevant OWASP or industry standard references.",
            "technicalDetails": "Technical Analysis: Detailed explanation derived from the supplied evidence. Use newlines to separate key points."
        }}
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
