import os
import json
import base64
import hashlib
import platform
import subprocess
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend

class DatabaseEncryption:
    def __init__(self):
        self._key = None
        self._machine_id = self._get_machine_id()

    def _get_machine_id(self):
        """Generates a unique machine identifier based on hardware info."""
        try:
            system = platform.system()
            if system == 'Windows':
                cmd = 'wmic csproduct get uuid'
                uuid = subprocess.check_output(cmd).decode().split('\n')[1].strip()
                return uuid
            elif system == 'Linux':
                with open('/etc/machine-id', 'r') as f:
                    return f.read().strip()
            elif system == 'Darwin':
                cmd = "ioreg -d2 -c IOPlatformExpertDevice | awk -F\\\" '/IOPlatformUUID/{print $(NF-1)}'"
                return subprocess.check_output(cmd, shell=True).decode().strip()
            else:
                return platform.node() # Fallback
        except Exception:
            return platform.node() # Fallback

    def _derive_key(self, salt):
        """Derives a 256-bit encryption key using PBKDF2."""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=600000, # OWASP recommendation
            backend=default_backend()
        )
        return kdf.derive(self._machine_id.encode())

    def encrypt_data(self, data):
        """Encrypts data using AES-256-GCM."""
        try:
            # Convert dict to JSON string if needed
            if isinstance(data, (dict, list)):
                data_bytes = json.dumps(data).encode('utf-8')
            elif isinstance(data, str):
                data_bytes = data.encode('utf-8')
            else:
                data_bytes = data

            # Generate random salt and nonce
            salt = os.urandom(16)
            nonce = os.urandom(12) # 96-bit nonce for GCM

            # Derive key
            key = self._derive_key(salt)

            # Encrypt using AES-GCM
            aesgcm = AESGCM(key)
            ciphertext = aesgcm.encrypt(nonce, data_bytes, None)

            # Combine salt + nonce + ciphertext
            # Structure: [Salt(16)][Nonce(12)][Ciphertext+Tag]
            encrypted_blob = salt + nonce + ciphertext
            
            return encrypted_blob
        except Exception as e:
            print(f"Encryption error: {e}")
            raise

    def decrypt_data(self, encrypted_blob):
        """Decrypts data using AES-256-GCM."""
        try:
            # Extract salt and nonce
            salt = encrypted_blob[:16]
            nonce = encrypted_blob[16:28]
            ciphertext = encrypted_blob[28:]

            # Derive key
            key = self._derive_key(salt)

            # Decrypt
            aesgcm = AESGCM(key)
            plaintext_bytes = aesgcm.decrypt(nonce, ciphertext, None)

            # Parse JSON
            return json.loads(plaintext_bytes.decode('utf-8'))
        except Exception as e:
            print(f"Decryption error or tampering detected: {e}")
            raise ValueError("Data integrity check failed. File may have been tampered with or is from another machine.")

# Singleton instance
encryptor = DatabaseEncryption()
