import os
import sys
import platform
import subprocess
import shutil
import tempfile
import json
import logging

logger = logging.getLogger(__name__)

# Fallback URL if GitHub API is unavailable
TESSERACT_FALLBACK_URL = (
    "https://github.com/UB-Mannheim/tesseract/releases/download/"
    "v5.5.0/tesseract-ocr-w64-setup-5.5.0.20241111.exe"
)
TESSERACT_INSTALLER_FILENAME = "tesseract-installer.exe"


def _get_app_tesseract_dir():
    """Return the app-local Tesseract installation directory."""
    if sys.platform == "win32":
        app_data = os.getenv("APPDATA", os.path.expanduser("~"))
        return os.path.join(app_data, "PentasecDesktop", "Tesseract-OCR")
    elif sys.platform == "darwin":
        return os.path.join(
            os.path.expanduser("~"), "Library", "Application Support",
            "PentasecDesktop", "Tesseract-OCR"
        )
    else:
        return os.path.join(
            os.path.expanduser("~"), ".local", "share",
            "PentasecDesktop", "Tesseract-OCR"
        )


def _get_windows_search_paths():
    """Common Windows installation paths for Tesseract."""
    paths = [_get_app_tesseract_dir()]

    program_files = os.getenv("ProgramFiles", r"C:\Program Files")
    program_files_x86 = os.getenv("ProgramFiles(x86)", r"C:\Program Files (x86)")
    local_app_data = os.getenv("LOCALAPPDATA", "")

    paths.extend([
        os.path.join(program_files, "Tesseract-OCR"),
        os.path.join(program_files_x86, "Tesseract-OCR"),
        os.path.join(local_app_data, "Tesseract-OCR"),
    ])
    return paths


def _get_latest_installer_url():
    """Fetch the latest Windows 64-bit installer URL from GitHub releases."""
    import urllib.request

    api_url = "https://api.github.com/repos/UB-Mannheim/tesseract/releases/latest"
    try:
        req = urllib.request.Request(
            api_url,
            headers={"Accept": "application/vnd.github.v3+json", "User-Agent": "Pentasec"}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())

        for asset in data.get("assets", []):
            name = asset.get("name", "")
            if "w64-setup" in name and name.endswith(".exe"):
                url = asset["browser_download_url"]
                logger.info(f"Found latest Tesseract installer: {name}")
                return url
    except Exception as e:
        logger.warning(f"Failed to fetch latest release from GitHub: {e}")

    logger.info("Using fallback Tesseract installer URL.")
    return TESSERACT_FALLBACK_URL


def find_tesseract():
    """
    Search for an existing Tesseract installation.
    Returns the path to the tesseract executable if found, None otherwise.
    """
    tesseract_cmd = shutil.which("tesseract")
    if tesseract_cmd:
        logger.info(f"Found Tesseract on PATH: {tesseract_cmd}")
        return tesseract_cmd

    if sys.platform == "win32":
        for search_dir in _get_windows_search_paths():
            candidate = os.path.join(search_dir, "tesseract.exe")
            if os.path.isfile(candidate):
                logger.info(f"Found Tesseract at: {candidate}")
                return candidate
    else:
        for path in [
            "/usr/bin/tesseract",
            "/usr/local/bin/tesseract",
            "/opt/homebrew/bin/tesseract",
        ]:
            if os.path.isfile(path):
                logger.info(f"Found Tesseract at: {path}")
                return path

    return None


def _download_file(url, dest_path):
    """Download a file from a URL to dest_path."""
    import urllib.request

    logger.info(f"Downloading Tesseract from {url}")
    print("[Tesseract] Downloading installer...")
    try:
        urllib.request.urlretrieve(url, dest_path)
        logger.info(f"Download complete: {dest_path}")
        print("[Tesseract] Download complete.")
        return True
    except Exception as e:
        logger.error(f"Download failed: {e}")
        print(f"[Tesseract] Download failed: {e}")
        return False


def _install_windows():
    """Download and silently install Tesseract on Windows."""
    install_dir = _get_app_tesseract_dir()
    tesseract_exe = os.path.join(install_dir, "tesseract.exe")

    if os.path.isfile(tesseract_exe):
        logger.info(f"Tesseract already installed at {install_dir}")
        return tesseract_exe

    installer_url = _get_latest_installer_url()
    temp_dir = tempfile.mkdtemp(prefix="pentasec_tesseract_")
    installer_path = os.path.join(temp_dir, TESSERACT_INSTALLER_FILENAME)

    try:
        if not _download_file(installer_url, installer_path):
            return None

        print(f"[Tesseract] Installing to {install_dir}...")
        logger.info(f"Running silent installer: {installer_path} -> {install_dir}")

        result = subprocess.run(
            [installer_path, "/S", f"/D={install_dir}"],
            timeout=300,
            capture_output=True,
        )

        if os.path.isfile(tesseract_exe):
            logger.info("Tesseract installation successful.")
            print("[Tesseract] Installation complete.")
            return tesseract_exe

        logger.error(
            f"Installer finished (code {result.returncode}) but tesseract.exe not found."
        )
        print("[Tesseract] Installation may have failed - executable not found.")
        return None

    except subprocess.TimeoutExpired:
        logger.error("Tesseract installer timed out.")
        print("[Tesseract] Installation timed out.")
        return None
    except Exception as e:
        logger.error(f"Installation error: {e}")
        print(f"[Tesseract] Installation error: {e}")
        return None
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def _install_macos():
    """Install Tesseract on macOS via Homebrew."""
    try:
        if not shutil.which("brew"):
            print("[Tesseract] Homebrew not found. Install from https://brew.sh")
            return None

        print("[Tesseract] Installing via Homebrew...")
        subprocess.run(["brew", "install", "tesseract"], check=True, timeout=300)

        path = shutil.which("tesseract")
        if path:
            print("[Tesseract] Installation complete.")
        return path
    except Exception as e:
        logger.error(f"Homebrew install failed: {e}")
        print(f"[Tesseract] Installation failed: {e}")
        return None


def _install_linux():
    """Install Tesseract on Linux via the system package manager."""
    try:
        if shutil.which("apt-get"):
            print("[Tesseract] Installing via apt-get...")
            subprocess.run(
                ["sudo", "apt-get", "update", "-y"],
                check=True, timeout=120,
            )
            subprocess.run(
                ["sudo", "apt-get", "install", "-y", "tesseract-ocr"],
                check=True, timeout=300,
            )
        elif shutil.which("dnf"):
            print("[Tesseract] Installing via dnf...")
            subprocess.run(
                ["sudo", "dnf", "install", "-y", "tesseract"],
                check=True, timeout=300,
            )
        elif shutil.which("pacman"):
            print("[Tesseract] Installing via pacman...")
            subprocess.run(
                ["sudo", "pacman", "-S", "--noconfirm", "tesseract"],
                check=True, timeout=300,
            )
        else:
            print("[Tesseract] No supported package manager found.")
            return None

        path = shutil.which("tesseract")
        if path:
            print("[Tesseract] Installation complete.")
        return path
    except Exception as e:
        logger.error(f"Linux install failed: {e}")
        print(f"[Tesseract] Installation failed: {e}")
        return None


def ensure_tesseract():
    """
    Find an existing Tesseract installation or install it automatically.
    Returns the path to the tesseract executable.
    Raises RuntimeError if Tesseract cannot be found or installed.
    """
    tesseract_path = find_tesseract()
    if tesseract_path:
        return tesseract_path

    print("[Tesseract] Not found. Starting automatic installation...")
    logger.info("Tesseract not found, starting automatic installation.")

    system = platform.system()

    if system == "Windows":
        tesseract_path = _install_windows()
    elif system == "Darwin":
        tesseract_path = _install_macos()
    elif system == "Linux":
        tesseract_path = _install_linux()
    else:
        raise RuntimeError(f"Unsupported operating system: {system}")

    if tesseract_path:
        return tesseract_path

    raise RuntimeError(
        "Tesseract OCR could not be installed automatically. "
        "Please install it manually:\n"
        "  Windows: https://github.com/UB-Mannheim/tesseract/releases\n"
        "  macOS:   brew install tesseract\n"
        "  Linux:   sudo apt-get install tesseract-ocr"
    )
