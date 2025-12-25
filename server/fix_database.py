import os
import django
from django.db import connection

# 1. Setup Django Access
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'disaster_management.settings') # Ensure this matches your project folder name
django.setup()

def fix_columns():
    print("🔧 Patching Database Columns for Django Compatibility...")

    # The SQL commands to add missing Django Auth columns
    commands = [
        # Required by AbstractBaseUser
        "ALTER TABLE users ADD COLUMN last_login DATETIME(6) NULL;",
        
        # Required by PermissionsMixin
        "ALTER TABLE users ADD COLUMN is_superuser TINYINT(1) NOT NULL DEFAULT 0;",
        
        # Required by your Custom Model definitions
        "ALTER TABLE users ADD COLUMN is_staff TINYINT(1) NOT NULL DEFAULT 0;",
        "ALTER TABLE users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;",
    ]

    with connection.cursor() as cursor:
        for sql in commands:
            try:
                cursor.execute(sql)
                print(f"✅ Success: {sql}")
            except Exception as e:
                # If column already exists (code 1060), ignore it
                if "1060" in str(e):
                    print(f"⚠️  Skipped (Already exists): {sql}")
                else:
                    print(f"❌ Error: {e}")

    print("\n🎉 Database patched! Try running the server now.")

if __name__ == '__main__':
    fix_columns()