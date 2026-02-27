from flask import Blueprint, jsonify, request
from utils import load_settings, save_settings

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/api/settings', methods=['GET'])
def get_settings():
    return jsonify(load_settings())

@settings_bp.route('/api/settings', methods=['POST'])
def update_settings():
    new_settings = request.json
    if save_settings(new_settings):
        return jsonify(new_settings), 200
    return jsonify({"error": "Failed to save settings"}), 500

status_bp = Blueprint('status', __name__)

@status_bp.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "running", "message": "Python backend is active"})
