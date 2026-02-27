import os
import time
import json
from flask import Blueprint, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename

from config import REPORT_ARCHIVE_IMAGES_DIR
from utils import load_report_archive, save_report_archive

report_bp = Blueprint('reports', __name__)

@report_bp.route('/api/report-drafts', methods=['GET'])
def get_report_drafts():
    data = load_report_archive()
    return jsonify(data['drafts'])

@report_bp.route('/api/report-images/<path:filename>', methods=['GET'])
def serve_report_image(filename):
    return send_from_directory(REPORT_ARCHIVE_IMAGES_DIR, filename)

@report_bp.route('/api/report-drafts', methods=['POST'])
def save_report_draft():
    data = load_report_archive()
    
    if request.mimetype.startswith('multipart/form-data'):
        try:
             new_draft = json.loads(request.form.get('data'))
        except (TypeError, json.JSONDecodeError):
             return jsonify({"error": "Invalid draft data in form"}), 400
             
        files = request.files.getlist('images')
    else:
        new_draft = request.json
        files = []
    
    if not new_draft:
        return jsonify({"error": "Invalid draft data"}), 400
        
    if 'id' not in new_draft:
        new_draft['id'] = str(int(time.time() * 1000))
    if 'createdDate' not in new_draft:
        new_draft['createdDate'] = time.strftime("%Y-%m-%d")
    if 'lastModified' not in new_draft:
        new_draft['lastModified'] = time.strftime("%Y-%m-%d")
    if 'status' not in new_draft:
        new_draft['status'] = 'draft'
    
    saved_image_paths = []
    if files:
        draft_img_dir = os.path.join(REPORT_ARCHIVE_IMAGES_DIR, new_draft['id'])
        if not os.path.exists(draft_img_dir):
            os.makedirs(draft_img_dir)
            
        for file in files:
            if file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join(draft_img_dir, filename)
                file.save(file_path)
                saved_image_paths.append(f"{new_draft['id']}/{filename}")
    
    existing_paths = new_draft.get('imagePaths', [])
    new_draft['imagePaths'] = existing_paths + saved_image_paths
        
    existing_index = -1
    for i, d in enumerate(data['drafts']):
        if d['id'] == new_draft.get('id'):
            existing_index = i
            break
            
    if existing_index != -1:
        new_draft['createdDate'] = data['drafts'][existing_index]['createdDate']                             
        new_draft['lastModified'] = time.strftime("%Y-%m-%d")
        data['drafts'][existing_index] = new_draft
    else:
        data['drafts'].append(new_draft)
    
    if save_report_archive(data):
        return jsonify(new_draft), 201
    else:
        return jsonify({"error": "Failed to save draft"}), 500

@report_bp.route('/api/report-drafts/<draft_id>', methods=['DELETE'])
def delete_report_draft(draft_id):
    data = load_report_archive()
    initial_count = len(data['drafts'])
    
    data['drafts'] = [d for d in data['drafts'] if d['id'] != draft_id]
    
    if len(data['drafts']) == initial_count:
        return jsonify({"error": "Draft not found"}), 404
        
    if save_report_archive(data):
        return jsonify({"message": "Draft deleted"}), 200
    else:
        return jsonify({"error": "Failed to save database"}), 500
