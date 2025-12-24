from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# --- CUSTOM USER MANAGER ---
class UserManager(BaseUserManager):
    def create_user(self, email, username, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'super_admin')

        return self.create_user(email, username, full_name, password, **extra_fields)

# --- CUSTOM USER MODEL ---
class User(AbstractBaseUser, PermissionsMixin):
    # Mapping existing Express columns to Django fields
    username = models.CharField(max_length=255, unique=True, db_column='user_name') # Maps to 'user_name'
    full_name = models.CharField(max_length=255, db_column='full_name')
    email = models.EmailField(max_length=255, unique=True, db_column='email')
    phone_number = models.CharField(max_length=255, unique=True, blank=True, null=True, db_column='phone_number')
    
    # Note: 'password' column exists, but Django handles it via set_password/check_password
    # We don't need db_column here if the name is exactly 'password'
    
    profile = models.CharField(max_length=255, blank=True, null=True, db_column='profile')
    
    # Role Logic
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('agent', 'Agent'),
        ('people', 'People'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='people', db_column='role')
    
    blood_group = models.CharField(max_length=5, blank=True, null=True, db_column='blood_group')
    location = models.JSONField(blank=True, null=True, db_column='location')

    # Express Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')
    updated_at = models.DateTimeField(auto_now=True, db_column='updated_at')

    # --- DJANGO REQUIRED FIELDS (These won't exist in your DB yet) ---
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) # Access to Django Admin

    objects = UserManager()

    USERNAME_FIELD = 'email'  # Login with Email
    REQUIRED_FIELDS = ['username', 'full_name']

    class Meta:
        db_table = 'users' # Connects to your existing table