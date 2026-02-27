import logging

logger = logging.getLogger(__name__)


def configure_tesseract():
    """Auto-detect or install Tesseract OCR and configure pytesseract."""
    import pytesseract
    from install_tesseract import ensure_tesseract

    tesseract_path = ensure_tesseract()
    pytesseract.pytesseract.tesseract_cmd = tesseract_path
    logger.info(f"Tesseract configured: {tesseract_path}")
    print(f"[Tesseract] Configured: {tesseract_path}")
