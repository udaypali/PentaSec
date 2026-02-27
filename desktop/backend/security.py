import os
import sys
from dotenv import load_dotenv

def load_env(env_file='.env'):
    """
    Loads variables into os.environ from the .env file.
    """
    try:
        search_paths = []
        
        if getattr(sys, 'frozen', False):
            # 1. Check bundled path (PyInstaller --onefile)
            if hasattr(sys, '_MEIPASS'):
                search_paths.append(os.path.join(sys._MEIPASS, env_file))
            
            # 2. Check next to executable
            search_paths.append(os.path.join(os.path.dirname(sys.executable), env_file))
        else:
            # 3. Check current directory and file directory (Development)
            base_path = os.path.dirname(os.path.abspath(__file__))
            search_paths.append(os.path.join(base_path, env_file))
            search_paths.append(env_file)
            
        full_path = None
        for path in search_paths:
            if os.path.exists(path):
                full_path = path
                break
        
        if not full_path:
            print(f"Warning: env file {env_file} not found in search paths: {search_paths}")
            return

        load_dotenv(dotenv_path=full_path)
                
    except Exception as e:
        print(f"Critical Error: Failed to load environment: {e}")
