import os
import shutil
import subprocess
import sys

APP_NAME = "backend"
ENTRY_FILE = "app.py"
DIST_DIR = "dist"
BUILD_DIR = "build"
SPEC_FILE = f"{APP_NAME}.spec"


def clean():
    """Remove old build artifacts."""
    print("[*] Cleaning old build artifacts...")
    for folder in [DIST_DIR, BUILD_DIR]:
        if os.path.exists(folder):
            shutil.rmtree(folder)

    if os.path.exists(SPEC_FILE):
        os.remove(SPEC_FILE)


def build():
    """Run PyInstaller with required flags."""
    print("[*] Building executable with PyInstaller...")

    command = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--clean",
        "--onefile",
        "--name",
        APP_NAME,
        "--add-data",
        ".env;.",
        ENTRY_FILE,
    ]

    subprocess.run(command, check=True)


def post_build():
    """Verify build output."""
    exe_path = os.path.join(DIST_DIR, f"{APP_NAME}.exe")

    if os.path.exists(exe_path):
        print("\n[✓] Build successful.")
        print(f"[✓] Executable located at: {exe_path}")
    else:
        print("\n[!] Build failed. Executable not found.")


if __name__ == "__main__":
    print("\n=== PentaSec Backend Build Script ===\n")

    clean()
    build()
    post_build()
