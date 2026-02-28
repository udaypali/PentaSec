import os
import json
import hashlib
import time
import datetime
import jwt
from functools import wraps
from flask import request, jsonify
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId

from config import SETTINGS_FILE, DB_FILE, REPORT_ARCHIVE_FILE, EVIDENCE_DIR
from encryption import encryptor
from database import db

def load_settings():
    if not os.path.exists(SETTINGS_FILE):
        return {
            "ai": {
                "provider": "gemini",
                "model": "gemini-2.5-flash",
                "apiKey": ""
            },
            "user": {
                "name": "Pentasec User",
                "email": "user@pentasec.ai",
                "report_count": 0,
                "image_count": 0
            },
            "theme": "system"
        }
    try:
        with open(SETTINGS_FILE, 'rb') as f:
            encrypted_data = f.read()
            
        try:
            return encryptor.decrypt_data(encrypted_data)
        except Exception:
            with open(SETTINGS_FILE, 'r') as f:
                data = json.load(f)
                
            save_settings(data)
            return data
            
    except Exception as e:
        print(f"Error loading settings: {e}")
        return {}

def save_settings(data):
    try:
        encrypted_data = encryptor.encrypt_data(data)
        
        with open(SETTINGS_FILE, 'wb') as f:
            f.write(encrypted_data)
        return True
    except Exception as e:
        print(f"Error saving settings: {e}")
        return False

def increment_user_stat(stat_key):
    """Increments a specific user statistic in settings.json safely."""
    settings = load_settings()
    if 'user' not in settings:
         settings['user'] = {
            "name": "Pentasec User", 
            "email": "user@pentasec.ai",
            "report_count": 0,
            "image_count": 0
        }
    
    current_val = settings['user'].get(stat_key, 0)
    settings['user'][stat_key] = current_val + 1
    save_settings(settings)

def get_ai_model():
    import google.generativeai as genai
    settings = load_settings()
    ai_settings = settings.get('ai', {})
    api_key = ai_settings.get('apiKey') or os.getenv("GEMINI_API_KEY")                          
    model_name = ai_settings.get('model', "gemini-2.5-flash")
    
    if not api_key:
        raise ValueError("API Key not found. Please configure it in settings.")
        
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(model_name)


def load_db():
    if not os.path.exists(DB_FILE):
        return {'projects': []}
    try:
        with open(DB_FILE, 'rb') as f:
            encrypted_data = f.read()
            
        try:
            return encryptor.decrypt_data(encrypted_data)
        except Exception:
            with open(DB_FILE, 'r') as f:
                data = json.load(f)
                
            save_db(data)
            return data
            
    except Exception as e:
        print(f"Error loading DB: {e}")
        return {'projects': []}

def save_db(data):
    try:
        encrypted_data = encryptor.encrypt_data(data)
        
        with open(DB_FILE, 'wb') as f:
            f.write(encrypted_data)
        return True
    except Exception as e:
        print(f"Error saving DB: {e}")
        return False

def load_report_archive():
    if not os.path.exists(REPORT_ARCHIVE_FILE):
        return {'drafts': []}
    try:
        with open(REPORT_ARCHIVE_FILE, 'rb') as f:
            encrypted_data = f.read()
            
        try:
            return encryptor.decrypt_data(encrypted_data)
        except Exception:
            with open(REPORT_ARCHIVE_FILE, 'r') as f:
                data = json.load(f)
                
            save_report_archive(data)
            return data
            
    except Exception as e:
        print(f"Error loading Report Archive: {e}")
        return {'drafts': []}

def save_report_archive(data):
    try:
        encrypted_data = encryptor.encrypt_data(data)
        
        with open(REPORT_ARCHIVE_FILE, 'wb') as f:
            f.write(encrypted_data)
        return True
    except Exception as e:
        print(f"Error saving Report Archive: {e}")
        return False

def get_evidence_folder_path(project_name, vuln_name, evidence_type):
    """Constructs the file path based on sanitized names."""
    sanitized_project = secure_filename(project_name)
    sanitized_vuln = secure_filename(vuln_name)
    
    folder_map = {
        'log': 'logs',
        'image': 'images',
        'report': 'reports'
    }
    folder_name = folder_map.get(evidence_type, 'misc')
    return os.path.join(EVIDENCE_DIR, sanitized_project, sanitized_vuln, folder_name)

def calculate_vulnerability_hash(project_name, vuln_name):
    """Calculates SHA-256 hash of the entire vulnerability folder."""
    sha256_hash = hashlib.sha256()
    
    sanitized_project = secure_filename(project_name)
    sanitized_vuln = secure_filename(vuln_name)
    base_path = os.path.join(EVIDENCE_DIR, sanitized_project, sanitized_vuln)
    
    if not os.path.exists(base_path):
        return None

    for root, dirs, files in os.walk(base_path):
        dirs.sort() 
        for names in sorted(files):
            filepath = os.path.join(root, names)
            try:
                with open(filepath, "rb") as f:
                    for byte_block in iter(lambda: f.read(4096), b""):
                        sha256_hash.update(byte_block)
            except Exception as e:
                print(f"Error reading file {filepath}: {e}")
                return None
                
    return sha256_hash.hexdigest()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] if len(request.headers['Authorization'].split(" ")) > 1 else request.headers['Authorization']
        
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        
        try:
            secret_key = os.getenv("SECRET_KEY")
            data = jwt.decode(token, secret_key, algorithms=["HS256"])
            try:
                user_id = ObjectId(data['user_id'])
            except:
                return jsonify({'error': 'Invalid user ID format!'}), 401

            current_user = db.users_collection.find_one({'_id': user_id}) if db.users_collection is not None else None
            
            if not current_user:
                 current_user = db.get_user_by_email(data['email'])
                 
            if not current_user:
                return jsonify({'error': 'User not found!'}), 401
                
        except Exception as e:
            print(f"Token error: {e}")                        
            return jsonify({'error': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated
