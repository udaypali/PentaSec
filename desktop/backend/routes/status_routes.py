from flask import Blueprint, jsonify
from version import APP_VERSION, REQUIRED_VERSION, is_version_satisfied

status_bp = Blueprint('status', __name__)

@status_bp.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "running", "message": "Python backend is active"})

@status_bp.route('/api/version', methods=['GET'])
def version():
    return jsonify({
        "app_version": APP_VERSION,
        "required_version": REQUIRED_VERSION,
        "version_ok": is_version_satisfied()
    })
