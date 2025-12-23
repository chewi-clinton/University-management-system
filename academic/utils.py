import hashlib
import secrets
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


def generate_university_reg_number():
    """Generate university registration number in format UNI-YYYY-XXXX"""
    current_year = timezone.now().year
    # This is a fallback method - actual generation is done in signals
    return f"UNI-{current_year}-0001"


def generate_enrollment_number(semester_number=1):
    """Generate enrollment number in format ENR-YYYY-S-XXXX"""
    current_year = timezone.now().year
    # This is a fallback method - actual generation is done in signals
    return f"ENR-{current_year}-{semester_number}-001"


def generate_application_number():
    """Generate application number in format APP-YYYY-XXXX"""
    current_year = timezone.now().year
    # This is a fallback method - actual generation is done in signals
    return f"APP-{current_year}-0001"


def encrypt_qr_payload(payload):
    """Encrypt QR code payload for security"""
    try:
        # Use Django's SECRET_KEY or a specific QR encryption key
        key = settings.QR_ENCRYPTION_KEY.encode()[:32].ljust(32)
        cipher = Fernet(key[:32].encode()[:32])
        
        # Add timestamp to payload
        timestamp = timezone.now().isoformat()
        data = f"{payload}|{timestamp}"
        
        encrypted = cipher.encrypt(data.encode())
        return encrypted.decode()
    except Exception as e:
        logger.error(f"Error encrypting QR payload: {e}")
        return None


def decrypt_qr_payload(encrypted_payload):
    """Decrypt and validate QR code payload"""
    try:
        key = settings.QR_ENCRYPTION_KEY.encode()[:32].ljust(32)
        cipher = Fernet(key[:32].encode()[:32])
        
        decrypted = cipher.decrypt(encrypted_payload.encode())
        data = decrypted.decode()
        
        # Split payload and timestamp
        parts = data.rsplit('|', 1)
        if len(parts) != 2:
            return None
        
        payload, timestamp_str = parts
        
        # Check if timestamp is within valid range (e.g., 5 minutes)
        timestamp = datetime.fromisoformat(timestamp_str)
        if timezone.now() - timestamp > timedelta(minutes=5):
            logger.warning(f"QR code expired: {timestamp}")
            return None
        
        return payload
    except Exception as e:
        logger.error(f"Error decrypting QR payload: {e}")
        return None


def calculate_gpa(grade_points_list, credit_hours_list):
    """Calculate GPA from grade points and credit hours"""
    if not grade_points_list or not credit_hours_list:
        return 0.0
    
    if len(grade_points_list) != len(credit_hours_list):
        raise ValueError("Grade points and credit hours lists must have the same length")
    
    total_points = sum(gp * ch for gp, ch in zip(grade_points_list, credit_hours_list))
    total_credits = sum(credit_hours_list)
    
    if total_credits == 0:
        return 0.0
    
    return round(total_points / total_credits, 2)


def grade_to_grade_points(grade):
    """Convert letter grade to grade points"""
    grade_mapping = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    }
    return grade_mapping.get(grade.upper(), 0.0)


def generate_verification_hash(data):
    """Generate verification hash for documents"""
    # Combine data with secret key for security
    combined = f"{data}{settings.SECRET_KEY}"
    return hashlib.sha256(combined.encode()).hexdigest()[:32]


def validate_email(email):
    """Validate email format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone):
    """Validate phone number format"""
    import re
    # Remove common separators
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    # Check if it contains only digits and has reasonable length
    return cleaned.isdigit() and 10 <= len(cleaned) <= 15


def generate_otp(length=6):
    """Generate a random OTP"""
    return ''.join(secrets.choice('0123456789') for _ in range(length))


def is_eligible_for_exam(student, exam):
    """Check if student is eligible for exam"""
    from .models import StudentCourseRegistration, Enrollment
    
    # Check if student is registered for the course
    try:
        registration = StudentCourseRegistration.objects.get(
            student=student,
            offering=exam.offering,
            status='registered'
        )
        
        # Check if enrollment is active
        enrollment = Enrollment.objects.get(
            student=student,
            semester=exam.offering.semester,
            status='confirmed'
        )
        
        # Check attendance requirement (minimum 75%)
        from .models import AttendanceSummary
        try:
            attendance_summary = AttendanceSummary.objects.get(
                student=student,
                offering=exam.offering
            )
            if attendance_summary.attendance_percentage < 75:
                return False, "Attendance below 75%"
        except AttendanceSummary.DoesNotExist:
            return False, "Attendance record not found"
        
        return True, "Eligible"
        
    except StudentCourseRegistration.DoesNotExist:
        return False, "Not registered for this course"
    except Enrollment.DoesNotExist:
        return False, "Enrollment not confirmed"


def format_schedule_for_display(schedule_dict):
    """Format schedule dictionary for display"""
    if not schedule_dict:
        return "Not scheduled"
    
    days = ', '.join(schedule_dict.get('days', []))
    time = schedule_dict.get('time', 'TBA')
    room = schedule_dict.get('room', 'TBA')
    
    return f"{days} {time} ({room})"


def get_academic_year(date=None):
    """Get academic year from date"""
    if date is None:
        date = timezone.now()
    
    # Academic year typically runs from July to June
    if date.month >= 7:
        return date.year
    else:
        return date.year - 1


def get_semester_from_date(date=None):
    """Determine semester from date"""
    if date is None:
        date = timezone.now()
    
    # Fall: July-December, Spring: January-June
    if date.month >= 7:
        return 'Fall'
    else:
        return 'Spring'


def send_notification(recipient, subject, message, notification_type='email'):
    """Send notification via email or SMS"""
    from .integrations.notifications import send_email_notification, send_sms_notification
    
    try:
        if notification_type == 'email':
            return send_email_notification(recipient, subject, message)
        elif notification_type == 'sms':
            return send_sms_notification(recipient, message)
        else:
            logger.error(f"Unknown notification type: {notification_type}")
            return False
    except Exception as e:
        logger.error(f"Error sending {notification_type} notification: {e}")
        return False