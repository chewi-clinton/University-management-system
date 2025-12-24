from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import vonage
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for sending notifications via email and SMS"""
    
    def __init__(self):
        # Initialize Vonage client for SMS
        self.vonage_client = None
        if hasattr(settings, 'VONAGE_API_KEY') and hasattr(settings, 'VONAGE_API_SECRET'):
            try:
                self.vonage_client = vonage.Client(
                    key=settings.VONAGE_API_KEY,
                    secret=settings.VONAGE_API_SECRET
                )
                self.sms = vonage.Sms(self.vonage_client)
                self.vonage_phone = settings.VONAGE_PHONE_NUMBER
                logger.info("Vonage client initialized successfully")
            except Exception as e:
                logger.error(f"Error initializing Vonage client: {e}")
    
    def send_email(self, recipient_email, subject, message, html_message=None, template_name=None, context=None):
        """Send email notification"""
        try:
            from_email = settings.DEFAULT_FROM_EMAIL
            
            if template_name and context:
                # Render HTML template
                html_message = render_to_string(template_name, context)
                plain_message = strip_tags(html_message)
            elif html_message:
                # Convert HTML to plain text
                plain_message = strip_tags(html_message)
            else:
                # Use message as plain text
                plain_message = message
                html_message = f"<html><body>{message}</body></html>"
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=from_email,
                recipient_list=[recipient_email],
                html_message=html_message,
                fail_silently=False
            )
            
            logger.info(f"Email sent successfully to {recipient_email}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending email to {recipient_email}: {e}")
            return False
    
    def send_sms(self, recipient_phone, message):
        """Send SMS notification"""
        if not self.vonage_client:
            logger.error("Vonage client not initialized")
            return False
        
        try:
            # Clean phone number
            recipient_phone = self._clean_phone_number(recipient_phone)
            
            response = self.sms.send_message({
                'from': self.vonage_phone,
                'to': recipient_phone,
                'text': message
            })
            
            if response['messages'][0]['status'] == '0':
                logger.info(f"SMS sent successfully to {recipient_phone}")
                return True
            else:
                logger.error(f"SMS failed: {response['messages'][0]['error-text']}")
                return False
            
        except Exception as e:
            logger.error(f"Error sending SMS to {recipient_phone}: {e}")
            return False
    
    def send_bulk_sms(self, recipient_phones, message):
        """Send bulk SMS to multiple recipients"""
        if not self.vonage_client:
            logger.error("Vonage client not initialized")
            return False
        
        results = []
        for phone in recipient_phones:
            success = self.send_sms(phone, message)
            results.append({
                'phone': phone,
                'success': success
            })
        
        return results
    
    def _clean_phone_number(self, phone):
        """Clean and format phone number for international format"""
        # Remove all non-digit characters
        import re
        digits = re.sub(r'\D', '', phone)
        
        # Add country code if not present (assuming US/Canada)
        if len(digits) == 10:
            digits = '1' + digits
        
        # Add plus sign
        return '+' + digits
    
    def send_notification(self, recipient, subject, message, notification_type='email', 
                         template_name=None, context=None):
        """Send notification based on type"""
        if notification_type == 'email':
            return self.send_email(
                recipient_email=recipient,
                subject=subject,
                message=message,
                template_name=template_name,
                context=context
            )
        elif notification_type == 'sms':
            return self.send_sms(
                recipient_phone=recipient,
                message=message
            )
        else:
            logger.error(f"Unsupported notification type: {notification_type}")
            return False


# Global notification service instance
notification_service = NotificationService()


def send_student_admission_confirmation(student):
    """Send admission confirmation to student"""
    try:
        subject = "Welcome to University - Admission Confirmed"
        
        # Email notification
        email_context = {
            'student_name': f"{student.first_name} {student.last_name}",
            'reg_number': student.university_reg_number,
            'program': student.program.program_name,
            'enrollment_date': student.enrollment_date
        }
        
        email_sent = notification_service.send_email(
            recipient_email=student.user.email,
            subject=subject,
            message="",
            template_name="emails/admission_confirmation.html",
            context=email_context
        )
        
        # SMS notification
        if student.phone:
            sms_message = f"Welcome {student.first_name}! Your admission to {student.program.program_name} is confirmed. Reg No: {student.university_reg_number}"
            sms_sent = notification_service.send_sms(student.phone, sms_message)
        else:
            sms_sent = False
        
        return {
            'success': True,
            'email_sent': email_sent,
            'sms_sent': sms_sent
        }
        
    except Exception as e:
        logger.error(f"Error sending admission confirmation: {e}")
        return {'success': False, 'error': str(e)}


def send_attendance_warning(student, course, attendance_percentage):
    """Send attendance warning to student"""
    try:
        subject = "Attendance Warning - Below 75%"
        
        message = f"Dear {student.first_name}, your attendance in {course.course_name} is {attendance_percentage}%, which is below the required 75%. Please improve your attendance to avoid any academic consequences."
        
        # Email notification
        email_sent = notification_service.send_email(
            recipient_email=student.user.email,
            subject=subject,
            message=message
        )
        
        # SMS notification
        if student.phone:
            sms_sent = notification_service.send_sms(student.phone, message)
        else:
            sms_sent = False
        
        return {
            'success': True,
            'email_sent': email_sent,
            'sms_sent': sms_sent
        }
        
    except Exception as e:
        logger.error(f"Error sending attendance warning: {e}")
        return {'success': False, 'error': str(e)}


def send_result_notification(student, semester, gpa):
    """Send result notification to student"""
    try:
        subject = f"Results Published - {semester.semester_name} {semester.session.academic_year}"
        
        message = f"Dear {student.first_name}, results for {semester.semester_name} {semester.session.academic_year} have been published. Your GPA: {gpa}. Login to view detailed results."
        
        # Email notification
        email_sent = notification_service.send_email(
            recipient_email=student.user.email,
            subject=subject,
            message=message
        )
        
        # SMS notification
        if student.phone:
            sms_sent = notification_service.send_sms(student.phone, message)
        else:
            sms_sent = False
        
        return {
            'success': True,
            'email_sent': email_sent,
            'sms_sent': sms_sent
        }
        
    except Exception as e:
        logger.error(f"Error sending result notification: {e}")
        return {'success': False, 'error': str(e)}


def send_class_reminder(students, zoom_class, reminder_time='1 hour'):
    """Send class reminder to students"""
    try:
        subject = f"Reminder: {zoom_class.topic} - Starting in {reminder_time}"
        
        message = f"Reminder: {zoom_class.topic} starts in {reminder_time}. Join link: {zoom_class.join_link}"
        
        email_recipients = []
        phone_numbers = []
        
        for student in students:
            email_recipients.append(student.user.email)
            if student.phone:
                phone_numbers.append(student.phone)
        
        # Send bulk email
        for email in email_recipients:
            notification_service.send_email(email, subject, message)
        
        # Send bulk SMS
        if phone_numbers:
            notification_service.send_bulk_sms(phone_numbers, message)
        
        return {
            'success': True,
            'emails_sent': len(email_recipients),
            'sms_sent': len(phone_numbers)
        }
        
    except Exception as e:
        logger.error(f"Error sending class reminder: {e}")
        return {'success': False, 'error': str(e)}


def send_faculty_notification(faculty, subject, message, notification_type='email'):
    """Send notification to faculty"""
    try:
        if notification_type == 'email':
            return notification_service.send_email(
                recipient_email=faculty.user.email,
                subject=subject,
                message=message
            )
        elif notification_type == 'sms' and faculty.user.faculty_profile.phone:
            return notification_service.send_sms(
                recipient_phone=faculty.user.faculty_profile.phone,
                message=message
            )
        return False
        
    except Exception as e:
        logger.error(f"Error sending faculty notification: {e}")
        return False


def send_admin_notification(admin_user, subject, message, notification_type='email'):
    """Send notification to admin"""
    try:
        if notification_type == 'email':
            return notification_service.send_email(
                recipient_email=admin_user.email,
                subject=subject,
                message=message
            )
        return False
        
    except Exception as e:
        logger.error(f"Error sending admin notification: {e}")
        return False