import os
import time
from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from utils import load_db, save_db, calculate_vulnerability_hash, get_evidence_folder_path

project_bp = Blueprint('projects', __name__)

@project_bp.route('/api/projects', methods=['GET'])
def get_projects():
    data = load_db()
    return jsonify(data['projects'])

@project_bp.route('/api/projects', methods=['POST'])
def add_project():
    data = load_db()
    new_project = request.json
    
    if not new_project or 'name' not in new_project:
        return jsonify({"error": "Invalid project data"}), 400
        
    new_project_name = new_project['name'].strip().lower()
    for existing_project in data.get('projects', []):
        if existing_project.get('name', '').strip().lower() == new_project_name:
            return jsonify({"error": "A project with this name already exists"}), 400
            
    if 'id' not in new_project:
        new_project['id'] = str(int(time.time() * 1000))
        
    if 'vulnerabilities' not in new_project:
        new_project['vulnerabilities'] = []
    if 'createdDate' not in new_project:
        new_project['createdDate'] = time.strftime("%Y-%m-%d")
        
    data['projects'].append(new_project)
    
    if save_db(data):
        return jsonify(new_project), 201
    else:
        return jsonify({"error": "Failed to save project"}), 500

@project_bp.route('/api/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    data = load_db()
    initial_count = len(data['projects'])
    
    data['projects'] = [p for p in data['projects'] if p['id'] != project_id]
    
    if len(data['projects']) == initial_count:
        return jsonify({"error": "Project not found"}), 404
        
    if save_db(data):
        return jsonify({"message": "Project deleted"}), 200
    else:
        return jsonify({"error": "Failed to save database"}), 500

@project_bp.route('/api/projects/<project_id>/vulnerabilities', methods=['POST'])
def add_vulnerability(project_id):
    data = load_db()
    new_vuln = request.json
    
    if not new_vuln or 'name' not in new_vuln:
        return jsonify({"error": "Invalid vulnerability data"}), 400
        
    project_index = -1
    for i, p in enumerate(data['projects']):
        if p['id'] == project_id:
            project_index = i
            break
            
    if project_index == -1:
        return jsonify({"error": "Project not found"}), 404
        
    project = data['projects'][project_index]
    new_vuln_name = new_vuln['name'].strip().lower()
    
    for existing_vuln in project.get('vulnerabilities', []):
        if existing_vuln.get('name', '').strip().lower() == new_vuln_name:
            return jsonify({"error": "A vulnerability with this name already exists in this project"}), 400
        
    if 'id' not in new_vuln:
        new_vuln['id'] = str(int(time.time() * 1000))
    if 'status' not in new_vuln:
        new_vuln['status'] = 'active'
    if 'createdDate' not in new_vuln:
        new_vuln['createdDate'] = time.strftime("%Y-%m-%d")
    if 'folders' not in new_vuln:
        new_vuln['folders'] = {
            "logs": [],
            "images": [],
            "reports": []
        }
    if 'description' not in new_vuln:
        new_vuln['description'] = ""
    if 'severity' not in new_vuln:
        new_vuln['severity'] = "Medium"

    if 'vulnerabilities' not in data['projects'][project_index]:
        data['projects'][project_index]['vulnerabilities'] = []
        
    data['projects'][project_index]['vulnerabilities'].append(new_vuln)
    
    if save_db(data):
        return jsonify(new_vuln), 201
    else:
        return jsonify({"error": "Failed to save vulnerability"}), 500

@project_bp.route('/api/projects/<project_id>/vulnerabilities/<vuln_id>', methods=['DELETE'])
def delete_vulnerability(project_id, vuln_id):
    data = load_db()
    
    project_index = -1
    for i, p in enumerate(data['projects']):
        if p['id'] == project_id:
            project_index = i
            break
            
    if project_index == -1:
        return jsonify({"error": "Project not found"}), 404
        
    project = data['projects'][project_index]
    if 'vulnerabilities' not in project:
         return jsonify({"error": "Vulnerability not found"}), 404

    initial_count = len(project['vulnerabilities'])
    project['vulnerabilities'] = [v for v in project['vulnerabilities'] if v['id'] != vuln_id]
    
    if len(project['vulnerabilities']) == initial_count:
        return jsonify({"error": "Vulnerability not found"}), 404
        
    data['projects'][project_index] = project
    
    if save_db(data):
        return jsonify({"message": "Vulnerability deleted"}), 200
    else:
        return jsonify({"error": "Failed to save database"}), 500

@project_bp.route('/api/projects/<project_id>/vulnerabilities/<vuln_id>/freeze', methods=['POST'])
def freeze_vulnerability(project_id, vuln_id):
    data = load_db()
    
    project_index = -1
    for i, p in enumerate(data['projects']):
        if p['id'] == project_id:
            project_index = i
            break
            
    if project_index == -1:
        return jsonify({"error": "Project not found"}), 404
        
    vuln_index = -1
    if 'vulnerabilities' in data['projects'][project_index]:
        for i, v in enumerate(data['projects'][project_index]['vulnerabilities']):
            if v['id'] == vuln_id:
                vuln_index = i
                break
                
    if vuln_index == -1:
        return jsonify({"error": "Vulnerability not found"}), 404
        
    if data['projects'][project_index]['vulnerabilities'][vuln_index].get('status') == 'frozen':
         return jsonify({"error": "Cannot modify a frozen vulnerability"}), 400

    project_name = data['projects'][project_index]['name']
    vuln_name = data['projects'][project_index]['vulnerabilities'][vuln_index]['name']
    
    folder_hash = calculate_vulnerability_hash(project_name, vuln_name)
    
    if not folder_hash:
        return jsonify({"error": "Could not calculate hash (folder might be empty)"}), 500
        
    data['projects'][project_index]['vulnerabilities'][vuln_index]['status'] = 'frozen'
    data['projects'][project_index]['vulnerabilities'][vuln_index]['vulnerabilityHash'] = folder_hash
    
    if save_db(data):
        return jsonify(data['projects'][project_index]['vulnerabilities'][vuln_index]), 200
    else:
        return jsonify({"error": "Failed to save database"}), 500

@project_bp.route('/api/projects/<project_id>/vulnerabilities/<vuln_id>/evidence', methods=['POST'])
def add_evidence(project_id, vuln_id):
    data = load_db()
    
    if 'file' not in request.files:
         return jsonify({"error": "No file part"}), 400
         
    file = request.files['file']
    name = request.form.get('name')
    evidence_type = request.form.get('type')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if not name or not evidence_type:
        return jsonify({"error": "Name and type are required."}), 400

    folder_map = {
        'log': 'logs',
        'image': 'images',
        'report': 'reports'
    }
    
    if evidence_type not in folder_map:
         return jsonify({"error": "Invalid evidence type. Must be log, image, or report."}), 400
         
    folder_name = folder_map[evidence_type]

    project_index = -1
    for i, p in enumerate(data['projects']):
        if p['id'] == project_id:
            project_index = i
            break
            
    if project_index == -1:
        return jsonify({"error": "Project not found"}), 404
        
    vuln_index = -1
    if 'vulnerabilities' in data['projects'][project_index]:
        for i, v in enumerate(data['projects'][project_index]['vulnerabilities']):
            if v['id'] == vuln_id:
                vuln_index = i
                break
                
        if vuln_index == -1:
            return jsonify({"error": "Vulnerability not found"}), 404

        if data['projects'][project_index]['vulnerabilities'][vuln_index].get('status') == 'frozen':
             return jsonify({"error": "Cannot modify a frozen vulnerability"}), 400

        project_name = data['projects'][project_index]['name']
        vuln_name = data['projects'][project_index]['vulnerabilities'][vuln_index]['name']

        save_dir = get_evidence_folder_path(project_name, vuln_name, evidence_type)
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
            
        filename = secure_filename(file.filename)
        file_path = os.path.join(save_dir, filename)
        file.save(file_path)
        
        size_bytes = os.path.getsize(file_path)
        if size_bytes < 1024:
            size_str = f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            size_str = f"{size_bytes / 1024:.1f} KB"
        else:
            size_str = f"{size_bytes / (1024 * 1024):.1f} MB"
            
        file_hash = "N/A"

    new_evidence = {
        "id": str(int(time.time() * 1000)),
        "name": name,
        "type": evidence_type,
        "dateAdded": time.strftime("%Y-%m-%d"),
        "size": size_str,
        "hash": file_hash, 
        "fullHash": file_hash,
        "filename": filename
    }

    if 'folders' not in data['projects'][project_index]['vulnerabilities'][vuln_index]:
        data['projects'][project_index]['vulnerabilities'][vuln_index]['folders'] = {
            "logs": [],
            "images": [],
            "reports": []
        }
        
    data['projects'][project_index]['vulnerabilities'][vuln_index]['folders'][folder_name].append(new_evidence)
    
    if save_db(data):
        return jsonify(new_evidence), 201
    else:
        return jsonify({"error": "Failed to save evidence"}), 500

@project_bp.route('/api/projects/<project_id>/vulnerabilities/<vuln_id>/evidence/<evidence_id>', methods=['DELETE'])
def delete_evidence(project_id, vuln_id, evidence_id):
    data = load_db()
    evidence_type = request.args.get('type')
    
    if not evidence_type:
        return jsonify({"error": "Evidence type is required"}), 400
        
    folder_map = {
        'log': 'logs',
        'image': 'images',
        'report': 'reports'
    }
    
    if evidence_type not in folder_map:
         return jsonify({"error": "Invalid evidence type"}), 400
         
    folder_name = folder_map[evidence_type]
    
    project_index = -1
    for i, p in enumerate(data['projects']):
        if p['id'] == project_id:
            project_index = i
            break
            
    if project_index == -1:
        return jsonify({"error": "Project not found"}), 404
        
    vuln_index = -1
    if 'vulnerabilities' in data['projects'][project_index]:
        for i, v in enumerate(data['projects'][project_index]['vulnerabilities']):
            if v['id'] == vuln_id:
                vuln_index = i
                break
                
    if vuln_index == -1:
        return jsonify({"error": "Vulnerability not found"}), 404
        
    if data['projects'][project_index]['vulnerabilities'][vuln_index].get('status') == 'frozen':
         return jsonify({"error": "Cannot modify a frozen vulnerability"}), 400
        
    project_name = data['projects'][project_index]['name']
    vuln_name = data['projects'][project_index]['vulnerabilities'][vuln_index]['name']

    evidence_list = data['projects'][project_index]['vulnerabilities'][vuln_index]['folders'][folder_name]
    
    found_evidence = None
    new_list = []
    for item in evidence_list:
        if item['id'] == evidence_id:
            found_evidence = item
        else:
            new_list.append(item)
            
    if not found_evidence:
        return jsonify({"error": "Evidence not found"}), 404
        
    data['projects'][project_index]['vulnerabilities'][vuln_index]['folders'][folder_name] = new_list
    
    if 'filename' in found_evidence:
        filename = found_evidence['filename']
        save_dir = get_evidence_folder_path(project_name, vuln_name, evidence_type)
        file_path = os.path.join(save_dir, filename)
        
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")
    
    if save_db(data):
        return jsonify({"message": "Evidence deleted"}), 200
    else:
        return jsonify({"error": "Failed to save database"}), 500

@project_bp.route('/api/projects/<project_id>/vulnerabilities/<vuln_id>/evidence/<evidence_id>/file', methods=['GET'])
def get_evidence_file(project_id, vuln_id, evidence_id):
    data = load_db()
    evidence_type = request.args.get('type')
    
    if not evidence_type:
        return jsonify({"error": "Evidence type is required"}), 400
        
    folder_map = {
        'log': 'logs',
        'image': 'images',
        'report': 'reports'
    }
    
    if evidence_type not in folder_map:
         return jsonify({"error": "Invalid evidence type"}), 400
         
    folder_name = folder_map[evidence_type]
    
    project_index = -1
    for i, p in enumerate(data['projects']):
        if p['id'] == project_id:
            project_index = i
            break
            
    if project_index == -1:
        return jsonify({"error": "Project not found"}), 404
        
    vuln_index = -1
    if 'vulnerabilities' in data['projects'][project_index]:
        for i, v in enumerate(data['projects'][project_index]['vulnerabilities']):
            if v['id'] == vuln_id:
                vuln_index = i
                break
                
    if vuln_index == -1:
        return jsonify({"error": "Vulnerability not found"}), 404
        
    project_name = data['projects'][project_index]['name']
    vuln_name = data['projects'][project_index]['vulnerabilities'][vuln_index]['name']

    evidence_list = data['projects'][project_index]['vulnerabilities'][vuln_index]['folders'][folder_name]
    found_evidence = next((item for item in evidence_list if item['id'] == evidence_id), None)
            
    if not found_evidence:
        return jsonify({"error": "Evidence not found"}), 404
        
    if 'filename' not in found_evidence:
         return jsonify({"error": "File not found in record"}), 404
         
    filename = found_evidence['filename']
    
    save_dir = get_evidence_folder_path(project_name, vuln_name, evidence_type)
    file_path = os.path.join(save_dir, filename)
    
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found on server"}), 404
        
    from flask import send_file
    return send_file(file_path)
