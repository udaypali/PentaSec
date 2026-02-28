import os
import sys

if getattr(sys, 'frozen', False):
    app_data_dir = os.path.join(os.getenv('APPDATA'), 'PentasecDesktop')
    if not os.path.exists(app_data_dir):
        os.makedirs(app_data_dir)
    DATA_DIR = os.path.join(app_data_dir, 'data')
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    DATABASE_DIR = os.path.join(DATA_DIR, 'database')
    if not os.path.exists(DATABASE_DIR):
        os.makedirs(DATABASE_DIR)
    DB_FILE = os.path.join(DATABASE_DIR, 'evidence_vault.json')
    EVIDENCE_DIR = os.path.join(DATA_DIR, 'evidence_files')
    REPORT_ARCHIVE_FILE = os.path.join(DATABASE_DIR, 'report_archive.json')
    REPORT_ARCHIVE_IMAGES_DIR = os.path.join(DATA_DIR, 'report_archive_images')
    if not os.path.exists(REPORT_ARCHIVE_IMAGES_DIR):
        os.makedirs(REPORT_ARCHIVE_IMAGES_DIR)
else:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.join(base_dir, 'data')
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    DATABASE_DIR = os.path.join(DATA_DIR, 'database')
    if not os.path.exists(DATABASE_DIR):
        os.makedirs(DATABASE_DIR)
    DB_FILE = os.path.join(DATABASE_DIR, 'evidence_vault.json')
    EVIDENCE_DIR = os.path.join(DATA_DIR, 'evidence_files')
    REPORT_ARCHIVE_FILE = os.path.join(DATABASE_DIR, 'report_archive.json')
    REPORT_ARCHIVE_IMAGES_DIR = os.path.join(DATA_DIR, 'report_archive_images')
    if not os.path.exists(REPORT_ARCHIVE_IMAGES_DIR):
        os.makedirs(REPORT_ARCHIVE_IMAGES_DIR)

SETTINGS_FILE = os.path.join(DATABASE_DIR, 'settings.json')

# Render backend URL — used by token_required to verify JWTs.
# Override with RENDER_URL env var for dev/testing.
RENDER_URL = os.getenv("RENDER_URL", "https://pentasec.onrender.com")
