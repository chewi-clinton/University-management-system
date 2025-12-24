from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import requests
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for sending notifications via email and Telegram"""
    
    def __init__(self):
        # Initialize Telegram Bot for messaging
        self.telegram_bot = None
        if hasattr(settings, 'TELEGRAM_BOT_TOKEN'):
            try:
                self.telegram_token = settings.TELEGRAM_BOT_TOKEN
                self.telegram_bot = True
                logger.info("Telegram bot initialized successfully")
            except Exception as e:
                logger.error(f"Error initializing Telegram bot: {e}")
    
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
    
    def send_telegram_message(self, chat_id, message):
        """Send message via Telegram Bot"""
        if not self.telegram_bot:
            logger.error("Telegram bot not configured")
            return False
        
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            data = {
                'chat_id': chat_id,
                'text': message,
                'parse_mode': 'HTML'
            }
            
            response = requests.post(url, data=data, timeout=10)
            
            if response.status_code == 200:
                logger.info(f"Telegram message sent successfully to {chat_id}")
                return True
            else:
                logger.error(f"Telegram API error: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending Telegram message: {e}")
            return False
    
    def send_bulk_telegram(self, chat_ids, message):
        """Send bulk messages via Telegram"""
        if not self.telegram_bot:
            logger.error("Telegram bot not configured")
            return []
        
        results = []
        for chat_id in chat_ids:
            success = self.send_telegram_message(chat_id, message)
            results.append({
                'chat_id': chat_id,
                'success': success
            })
        
        return results
    
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
        elif notification_type in ('sms', 'telegram'):
            # recipient must be the telegram_chat_id
            return self.send_telegram_message(
                chat_id=recipient,
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
        
        # Telegram notification
        telegram_sent = False
        if getattr(student, 'telegram_chat_id', None):
            telegram_message = f"Welcome {student.first_name}! Your admission to {student.program.program_name} is confirmed. Reg No: {student.university_reg_number}"
            telegram_sent = notification_service.send_telegram_message(student.telegram_chat_id, telegram_message)
        
        return {
            'success': True,
            'email_sent': email_sent,
            'telegram_sent': telegram_sent  # Updated key name for clarity
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
        
        # Telegram notification
        telegram_sent = False
        if getattr(student, 'telegram_chat_id', None):
            telegram_sent = notification_service.send_telegram_message(student.telegram_chat_id, message)
        
        return {
            'success': True,
            'email_sent': email_sent,
            'telegram_sent': telegram_sent  # Updated key name for clarity
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
        
        # Telegram notification
        telegram_sent = False
        if getattr(student, 'telegram_chat_id', None):
            telegram_sent = notification_service.send_telegram_message(student.telegram_chat_id, message)
        
        return {
            'success': True,
            'email_sent': email_sent,
            'telegram_sent': telegram_sent  # Updated key name for clarity
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
        telegram_chat_ids = []
        
        for student in students:
            email_recipients.append(student.user.email)
            if getattr(student, 'telegram_chat_id', None):
                telegram_chat_ids.append(student.telegram_chat_id)
        
        # Send individual emails (bulk email via Django not used to preserve HTML/templates if needed)
        for email in email_recipients:
            notification_service.send_email(email, subject, message)
        
        # Send bulk Telegram
        telegram_results = []
        if telegram_chat_ids:
            telegram_results = notification_service.send_bulk_telegram(telegram_chat_ids, message)
        
        return {
            'success': True,
            'emails_sent': len(email_recipients),
            'telegram_sent': len([r for r in telegram_results if r['success']])
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
        elif notification_type in ('sms', 'telegram'):
            if getattr(faculty, 'telegram_chat_id', None):
                return notification_service.send_telegram_message(
                    chat_id=faculty.telegram_chat_id,
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
        # No Telegram support for admins in current implementation
        return False
        
    except Exception as e:
        logger.error(f"Error sending admin notification: {e}")
        return False