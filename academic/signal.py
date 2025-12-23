from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import (
    Student, Enrollment, Applicant, AttendanceSummary
)
from .utils import generate_university_reg_number, generate_enrollment_number, generate_application_number
import logging

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Student)
def generate_student_reg_number(sender, instance, **kwargs):
    """Auto-generate university registration number"""
    if not instance.university_reg_number:
        current_year = timezone.now().year
        # Get the last student to determine the next sequence number
        last_student = Student.objects.filter(
            university_reg_number__startswith=f'UNI-{current_year}-'
        ).order_by('-university_reg_number').first()
        
        if last_student:
            # Extract sequence number and increment
            last_number = int(last_student.university_reg_number.split('-')[-1])
            sequence_number = last_number + 1
        else:
            sequence_number = 1
        
        instance.university_reg_number = f'UNI-{current_year}-{sequence_number:04d}'
        logger.info(f"Generated registration number: {instance.university_reg_number}")


@receiver(pre_save, sender=Enrollment)
def generate_enrollment_number(sender, instance, **kwargs):
    """Auto-generate enrollment number"""
    if not instance.enrollment_number:
        current_year = timezone.now().year
        semester_number = instance.semester.semester_number
        
        # Get the last enrollment for this semester type
        last_enrollment = Enrollment.objects.filter(
            enrollment_number__startswith=f'ENR-{current_year}-{semester_number}-'
        ).order_by('-enrollment_number').first()
        
        if last_enrollment:
            # Extract sequence number and increment
            last_number = int(last_enrollment.enrollment_number.split('-')[-1])
            sequence_number = last_number + 1
        else:
            sequence_number = 1
        
        instance.enrollment_number = f'ENR-{current_year}-{semester_number}-{sequence_number:03d}'
        logger.info(f"Generated enrollment number: {instance.enrollment_number}")


@receiver(pre_save, sender=Applicant)
def generate_application_number(sender, instance, **kwargs):
    """Auto-generate application number"""
    if not instance.application_number:
        current_year = timezone.now().year
        
        # Get the last application
        last_application = Applicant.objects.filter(
            application_number__startswith=f'APP-{current_year}-'
        ).order_by('-application_number').first()
        
        if last_application:
            # Extract sequence number and increment
            last_number = int(last_application.application_number.split('-')[-1])
            sequence_number = last_number + 1
        else:
            sequence_number = 1
        
        instance.application_number = f'APP-{current_year}-{sequence_number:04d}'
        logger.info(f"Generated application number: {instance.application_number}")


@receiver(post_save, sender=Attendance)
def update_attendance_summary(sender, instance, created, **kwargs):
    """Update attendance summary when attendance is marked"""
    if created or instance.status != instance._state.adding and hasattr(instance, '_old_status'):
        # Get or create attendance summary
        summary, created = AttendanceSummary.objects.get_or_create(
            student=instance.student,
            offering=instance.offering,
            defaults={'last_updated': timezone.now().date()}
        )
        
        # Recalculate attendance
        attendance_records = Attendance.objects.filter(
            student=instance.student,
            offering=instance.offering
        )
        
        total_classes = attendance_records.count()
        attended_classes = attendance_records.filter(status__in=['present', 'late']).count()
        
        summary.total_classes = total_classes
        summary.attended_classes = attended_classes
        
        if total_classes > 0:
            summary.attendance_percentage = (attended_classes / total_classes) * 100
        else:
            summary.attendance_percentage = 0
        
        summary.last_updated = timezone.now().date()
        
        # Check if warning should be sent (below 75%)
        if summary.attendance_percentage < 75 and not summary.warning_sent:
            # Here you would trigger a notification
            logger.warning(f"Attendance below 75% for {instance.student}: {summary.attendance_percentage}%")
            # summary.warning_sent = True  # Set this when notification is sent
        
        summary.save()


@receiver(post_save, sender=StudentCourseRegistration)
def update_enrollment_count(sender, instance, created, **kwargs):
    """Update course offering enrollment count"""
    if created and instance.status == 'registered':
        offering = instance.offering
        offering.current_enrollment = StudentCourseRegistration.objects.filter(
            offering=offering,
            status='registered'
        ).count()
        offering.save()
    elif not created and instance.status == 'withdrawn':
        offering = instance.offering
        offering.current_enrollment = max(0, offering.current_enrollment - 1)
        offering.save()


@receiver(post_save, sender=Grade)
def update_student_gpa(sender, instance, created, **kwargs):
    """Update student GPA when grades are finalized"""
    if instance.is_finalized and not created:
        student = instance.student
        
        # Calculate GPA for all completed courses
        registrations = StudentCourseRegistration.objects.filter(
            student=student,
            status='completed',
            grade_points__isnull=False
        )
        
        if registrations.exists():
            total_points = sum(reg.grade_points * reg.offering.course.credit_hours 
                             for reg in registrations)
            total_credits = sum(reg.offering.course.credit_hours for reg in registrations)
            
            if total_credits > 0:
                student.current_gpa = total_points / total_credits
                student.save()
                logger.info(f"Updated GPA for {student}: {student.current_gpa}")


# Store old status for comparison
@receiver(pre_save, sender=StudentCourseRegistration)
def store_old_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = StudentCourseRegistration.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except StudentCourseRegistration.DoesNotExist:
            instance._old_status = None