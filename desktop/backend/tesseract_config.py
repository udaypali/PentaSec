import os
import sys

def configure_tesseract():
    import pytesseract
    if getattr(sys, 'frozen', False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))

    tesseract_path = os.path.join(base_path, "resources", "tesseract", "tesseract.exe")

    if not os.path.exists(tesseract_path):
        raise RuntimeError(f"Tesseract not found at {tesseract_path}")

    pytesseract.pytesseract.tesseract_cmd = tesseract_path
