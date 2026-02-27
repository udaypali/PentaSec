import datetime
import jwt
import requests
from flask import Blueprint, jsonify, request

import os
from database import db
from utils import token_required

auth_bp = Blueprint('auth', __name__)

oauth_tokens = {}

@auth_bp.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"error": "Email, password, and name are required"}), 400

    user_id = db.create_user(email, password, name)
    if user_id:
        return jsonify({"message": "User created successfully", "userId": user_id}), 201
    else:
        return jsonify({"error": "User already exists or creation failed"}), 400

@auth_bp.route('/api/auth/callback/google', methods=['GET'])
def google_callback():
    return """
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <title>Authentication</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        body {
            height: 100vh;
            background: radial-gradient(circle at top, #1f1f1f, #0d0d0d 70%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }

        .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            padding: 50px 60px;
            border-radius: 20px;
            text-align: center;
            width: 420px;
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #4cafef;
            border-radius: 50%;
            margin: 0 auto 25px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .icon {
            font-size: 60px;
            margin-bottom: 20px;
        }

        .success { color: #4CAF50; }
        .error { color: #ff4d4d; }

        h2 {
            font-weight: 600;
            margin-bottom: 12px;
        }

        p {
            color: #aaa;
            font-size: 14px;
        }
    </style>
    </head>

    <body>

    <div class="card" id="card">
        <div class="spinner"></div>
        <h2>Authenticating...</h2>
        <p>Securely verifying your Google account</p>
    </div>

    <script>
        const card = document.getElementById("card");

        function showError(message) {
            card.innerHTML = `
                <div class="icon error">✖</div>
                <h2 class="error">Login Failed</h2>
                <p>${message}</p>
            `;
        }

        function showSuccess() {
            card.innerHTML = `
                <div class="icon success">✔</div>
                <h2 class="success">Login Successful</h2>
                <p>You can close this window and return to the app.</p>
            `;
            setTimeout(() => window.close(), 3000);
        }

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const idToken = params.get('id_token') || params.get('access_token');
        const sessionId = params.get('state');
        const error = params.get('error');

        if (error) {
            showError(error);
        } 
        else if (idToken && sessionId) {

            fetch('http://127.0.0.1:5000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
            })
            .then(res => res.json())
            .then(data => {
                if (!data.token) throw new Error(data.error || 'Validation failed');

                return fetch('http://127.0.0.1:5000/api/auth/oauth-store', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: data.token,
                        user: data.user,
                        session_id: sessionId
                    })
                });
            })
            .then(res => {
                if (!res.ok) throw new Error('Failed to store session');
                showSuccess();
            })
            .catch(err => showError(err.message));

        } else {
            showError("Invalid response from Google.");
        }
    </script>

    </body>
    </html>
    """

@auth_bp.route('/api/auth/google', methods=['POST'])
def google_auth():
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({"error": "Token is required"}), 400
        
    try:
        google_response = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={token}')
        if google_response.status_code != 200:
            return jsonify({"error": "Invalid Google token"}), 401
            
        google_data = google_response.json()
        email = google_data.get('email')
        name = google_data.get('name')
        picture = google_data.get('picture')                               
        
        user = db.get_user_by_email(email)
        
        if not user:
            return jsonify({"error": "No account found with this email. Please contact an administrator to create an account."}), 403
        
        if picture:
            db.update_user(email, {'picture': picture})
            user['picture'] = picture
            
        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
             return jsonify({"error": "Configuration error"}), 500
             
        jwt_token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, secret_key, algorithm="HS256")
        
        return jsonify({
            "token": jwt_token,
            "user": {
                "email": user['email'],
                "name": user.get('name', "User"),
                "picture": user.get('picture')
            }
        }), 200
        
    except Exception as e:
        print(f"Google Auth Error: {e}")
        return jsonify({"error": "Authentication failed"}), 500

@auth_bp.route('/api/auth/oauth-store', methods=['POST'])
def store_oauth_token():
    """Store OAuth token temporarily for Electron app to retrieve"""
    data = request.json
    token = data.get('token')
    user = data.get('user')
    session_id = data.get('session_id')
    
    if not token or not session_id:
        return jsonify({"error": "Token and session_id required"}), 400
    
    oauth_tokens[session_id] = {
        'token': token,
        'user': user,
        'timestamp': datetime.datetime.utcnow()
    }
    
    return jsonify({"message": "Token stored"}), 200

@auth_bp.route('/api/auth/oauth-retrieve/<session_id>', methods=['GET'])
def retrieve_oauth_token(session_id):
    """Retrieve OAuth token for Electron app"""
    if session_id in oauth_tokens:
        data = oauth_tokens.pop(session_id)                          
        return jsonify(data), 200
    return jsonify({"error": "No token found"}), 404

@auth_bp.route('/api/auth/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = db.get_user_by_email(email)
    
    if user and db.verify_password(password, user['password']):
        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
             return jsonify({"error": "Configuration error"}), 500
             
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, secret_key, algorithm="HS256")
        
        return jsonify({
            "token": token,
            "user": {
                "email": user['email'],
                "name": user.get('name', f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or "User")
            }
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        "name": current_user.get('name', f"{current_user.get('firstName', '')} {current_user.get('lastName', '')}".strip() or "User"),
        "email": current_user['email'],
        "report_count": current_user.get('report_count', 0),
        "image_count": current_user.get('image_count', 0),
        "picture": current_user.get('picture')
    })

@auth_bp.route('/api/auth/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.json
    name = data.get('name')
    email = data.get('email')
    
    update_data = {}
    if name:
        update_data['name'] = name
        
    if not update_data:
        return jsonify({"message": "No changes provided"}), 200
        
    if db.update_user(current_user['email'], update_data):
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update profile"}), 500
