import os
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt
import logging
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# from dotenv import load_dotenv # Removed for encryption
from security import load_env

# Load environment variables
load_env()

MONGODB_URI = os.getenv("MONGODB_URI")


class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.users_collection = None
        self._connect()

    def _connect(self):
        if not MONGODB_URI:
            logger.error("MONGODB_URI not found in environment variables.")
            return

        try:
            # Create a new client and connect to the server
            self.client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
            
            # Send a ping to confirm a successful connection
            self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB!")
            
            self.db = self.client['pentasec'] # Database name
            self.users_collection = self.db['users'] # Collection name
            
            # Create unique index on email
            self.users_collection.create_index("email", unique=True)
            
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {e}")
            self.client = None

    def get_user_by_email(self, email):
        if self.users_collection is None:
             logger.error("Database not connected.")
             return None
        try:
            return self.users_collection.find_one({"email": email})
        except Exception as e:
            logger.error(f"Error finding user: {e}")
            return None

    def create_user(self, email, password=None, name=None, provider="local", picture=None):
        if self.users_collection is None:
             logger.error("Database not connected.")
             return None
             
        if self.get_user_by_email(email):
            logger.warning(f"User with email {email} already exists.")
            return None
            
        try:
            user_data = {
                "email": email,
                "name": name,
                "provider": provider
            }
            
            if password:
                hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
                user_data["password"] = hashed_password
            
            if picture:
                user_data["picture"] = picture
            
            result = self.users_collection.insert_one(user_data)
            logger.info(f"User created with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None

    def verify_password(self, plain_password, hashed_password):
        try:
            # Ensure hashed_password is bytes
            if isinstance(hashed_password, str):
                 hashed_password = hashed_password.encode('utf-8')
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)
        except Exception as e:
             logger.error(f"Error verifying password: {e}")
             return False

    def update_user(self, email, update_data):
        if self.users_collection is None:
             logger.error("Database not connected.")
             return None
        
        try:
            # Prevent updating email to one that already exists (if email is being updated)
            if 'email' in update_data and update_data['email'] != email:
                if self.get_user_by_email(update_data['email']):
                    logger.warning(f"User with email {update_data['email']} already exists.")
                    return False
            
            result = self.users_collection.update_one(
                {"email": email},
                {"$set": update_data}
            )
            return result.modified_count > 0 or result.matched_count > 0
        except Exception as e:
            logger.error(f"Error updating user: {e}")
            return False
            
    def increment_usage(self, email, field, amount=1):
        if self.users_collection is None:
             logger.error("Database not connected.")
             return False
        try:
            result = self.users_collection.update_one(
                {"email": email},
                {"$inc": {field: amount}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error incrementing usage: {e}")
            return False

# Initialize database instance
db = Database()
