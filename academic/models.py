from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid


class User(AbstractUser):
    """Base user model (polymorphic)"""
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('academic_admin', 'Academic Admin'),
        ('super_admin', 'Super Admin'),
    ]
    
    # Remove username field, use email as primary identifier
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'


class Faculty(models.Model):
    """Faculties (e.g., Faculty of Engineering)"""
    faculty_id = models.AutoField(primary_key=True)
    faculty_name = models.CharField(max_length=200)
    dean = models.ForeignKey('Faculty', on_delete=models.SET_NULL, null=True, blank=True, related_name='dean_faculty')
    faculty_code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        db_table = 'faculties'
        verbose_name_plural = 'Faculties'
    
    def __str__(self):
        return self.faculty_name


class Department(models.Model):
    """Departments (e.g., Computer Science)"""
    department_id = models.AutoField(primary_key=True)
    department_name = models.CharField(max_length=200)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='departments')
    head = models.ForeignKey('Faculty', on_delete=models.SET_NULL, null=True, blank=True, related_name='head_department')
    department_code = models.CharField(max_length=20, unique=True)
    office_location = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'departments'
    
    def __str__(self):
        return self.department_name


class Program(models.Model):
    """Academic Programs (e.g., BSc Computer Science)"""
    PROGRAM_TYPES = [
        ('undergraduate', 'Undergraduate'),
        ('graduate', 'Graduate'),
        ('doctoral', 'Doctoral'),
    ]
    
    program_id = models.AutoField(primary_key=True)
    program_name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='programs')
    program_code = models.CharField(max_length=20, unique=True)
    duration_years = models.IntegerField(validators=[MinValueValidator(1)])
    total_credits_required = models.IntegerField(validators=[MinValueValidator(1)])
    program_type = models.CharField(max_length=50, choices=PROGRAM_TYPES)
    description = models.TextField(blank=True)
    admission_requirements = models.TextField(blank=True)
    
    class Meta:
        db_table = 'programs'
    
    def __str__(self):
        return self.program_name


class Course(models.Model):
    """Courses (e.g., CS101 - Introduction to Programming)"""
    course_id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=20, unique=True)
    course_name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    credit_hours = models.IntegerField(validators=[MinValueValidator(1)])
    is_elective = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    syllabus = models.TextField(blank=True)
    learning_outcomes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'courses'
    
    def __str__(self):
        return f"{self.course_code} - {self.course_name}"


class CoursePrerequisite(models.Model):
    """Course prerequisites (many-to-many self-join)"""
    prerequisite_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_prerequisites')
    prerequisite_course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='prerequisite_for')
    is_mandatory = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'course_prerequisites'
        unique_together = ['course', 'prerequisite_course']
    
    def clean(self):
        if self.course == self.prerequisite_course:
            raise ValidationError("A course cannot be a prerequisite for itself")


class AcademicSession(models.Model):
    """Academic Sessions (e.g., Fall 2025)"""
    session_id = models.AutoField(primary_key=True)
    session_name = models.CharField(max_length=100)
    academic_year = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'academic_sessions'
    
    def __str__(self):
        return self.session_name


class Semester(models.Model):
    """Semesters within sessions"""
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    semester_id = models.AutoField(primary_key=True)
    session = models.ForeignKey(AcademicSession, on_delete=models.CASCADE, related_name='semesters')
    semester_number = models.IntegerField()  # 1, 2, 3...
    semester_name = models.CharField(max_length=100)  # "Fall", "Spring", "Summer"
    start_date = models.DateField()
    end_date = models.DateField()
    enrollment_start_date = models.DateField()
    enrollment_end_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='upcoming')
    
    class Meta:
        db_table = 'semesters'
        constraints = [
            models.CheckConstraint(
                check=models.Q(semester_number__gte=1) & models.Q(semester_number__lte=3),
                name='check_semester_number_range'
            )
        ]
    
    def __str__(self):
        return f"{self.semester_name} {self.session.academic_year}"


class Student(models.Model):
    """Student-specific data"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('graduated', 'Graduated'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    student_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    university_reg_number = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    profile_picture_url = models.URLField(max_length=500, blank=True)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='students')
    enrollment_date = models.DateField()
    current_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')
    current_gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        db_table = 'students'
        indexes = [
            models.Index(fields=['user_id']),
            models.Index(fields=['program_id']),
        ]
    
    def __str__(self):
        return f"{self.university_reg_number} - {self.first_name} {self.last_name}"


class Faculty(models.Model):
    """Faculty-specific data (renamed to avoid conflict with Faculty model)"""
    faculty_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='faculty_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    designation = models.CharField(max_length=100, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='faculty_members')
    office_number = models.CharField(max_length=20, blank=True)
    office_hours = models.TextField(blank=True)
    hire_date = models.DateField()
    qualification = models.TextField(blank=True)
    
    class Meta:
        db_table = 'faculty'
    
    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name()}"


class AcademicAdmin(models.Model):
    """Academic Admin data"""
    admin_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='admins', null=True, blank=True)
    permissions = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'academic_admins'
        verbose_name_plural = 'Academic Admins'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - Admin"


class Enrollment(models.Model):
    """Student enrollments per semester"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('dropped', 'Dropped'),
        ('frozen', 'Frozen'),
    ]
    
    enrollment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='enrollments')
    enrollment_number = models.CharField(max_length=50, unique=True)
    enrollment_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='confirmed')
    confirmed_by_admin = models.ForeignKey(AcademicAdmin, on_delete=models.SET_NULL, null=True, blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'enrollments'
        unique_together = ['student', 'semester']
        indexes = [
            models.Index(fields=['student_id', 'semester_id']),
        ]
    
    def __str__(self):
        return f"{self.enrollment_number} - {self.student}"


class CourseOffering(models.Model):
    """Course offerings per semester"""
    offering_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='offerings')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='course_offerings')
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='course_offerings')
    section = models.CharField(max_length=10)
    schedule = models.JSONField(default=dict)  # {days: ["Mon", "Wed"], time: "10:00-11:30", room: "CS-101"}
    max_students = models.IntegerField(default=50)
    current_enrollment = models.IntegerField(default=0)
    is_visible = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'course_offerings'
    
    def __str__(self):
        return f"{self.course.course_code} - {self.section} ({self.semester})"


class StudentCourseRegistration(models.Model):
    """Student course registrations"""
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('withdrawn', 'Withdrawn'),
        ('completed', 'Completed'),
    ]
    
    registration_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='course_registrations')
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name='registrations')
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='course_registrations')
    registration_date = models.DateTimeField(default=timezone.now)
    grade = models.CharField(max_length=5, blank=True)
    grade_points = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='registered')
    
    class Meta:
        db_table = 'student_course_registrations'
        unique_together = ['student', 'offering']
        indexes = [
            models.Index(fields=['student_id']),
        ]
    
    def __str__(self):
        return f"{self.student} - {self.offering}"


class Attendance(models.Model):
    """Daily attendance records"""
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]
    
    attendance_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name='attendance_records')
    attendance_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    marked_by_faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='marked_attendance')
    marked_at = models.DateTimeField(default=timezone.now)
    remarks = models.TextField(blank=True)
    qr_token = models.CharField(max_length=255, blank=True)
    scanned_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'attendance'
        unique_together = ['student', 'offering', 'attendance_date']
        indexes = [
            models.Index(fields=['student_id', 'offering_id', 'attendance_date']),
        ]
    
    def __str__(self):
        return f"{self.student} - {self.attendance_date} - {self.status}"


class AttendanceSummary(models.Model):
    """Attendance summaries (materialized view or regularly updated)"""
    summary_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_summaries')
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name='attendance_summaries')
    total_classes = models.IntegerField(default=0)
    attended_classes = models.IntegerField(default=0)
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    last_updated = models.DateField()
    warning_sent = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'attendance_summaries'
        unique_together = ['student', 'offering']
    
    def __str__(self):
        return f"{self.student} - {self.offering} - {self.attendance_percentage}%"


class Grade(models.Model):
    """Grades for assignments/exams"""
    grade_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name='grades')
    assessment_type = models.CharField(max_length=50)  # assignment, midterm, final, quiz
    assessment_name = models.CharField(max_length=200)
    marks_obtained = models.DecimalField(max_digits=6, decimal_places=2)
    max_marks = models.DecimalField(max_digits=6, decimal_places=2)
    weightage = models.DecimalField(max_digits=5, decimal_places=2)  # percentage of final grade
    graded_by_faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='graded_assessments')
    graded_at = models.DateTimeField(default=timezone.now)
    is_finalized = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'grades'
        indexes = [
            models.Index(fields=['student_id', 'offering_id']),
        ]
    
    def __str__(self):
        return f"{self.student} - {self.assessment_name} - {self.marks_obtained}/{self.max_marks}"


class Examination(models.Model):
    """Exams"""
    EXAM_TYPES = [
        ('midterm', 'Midterm'),
        ('final', 'Final'),
        ('quiz', 'Quiz'),
        ('practical', 'Practical'),
    ]
    
    exam_id = models.AutoField(primary_key=True)
    exam_name = models.CharField(max_length=200)
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name='examinations')
    exam_type = models.CharField(max_length=50, choices=EXAM_TYPES)
    total_marks = models.DecimalField(max_digits=6, decimal_places=2)
    weightage = models.DecimalField(max_digits=5, decimal_places=2)
    syllabus_portion = models.TextField(blank=True)
    instructions = models.TextField(blank=True)
    
    class Meta:
        db_table = 'examinations'
    
    def __str__(self):
        return f"{self.exam_name} - {self.offering}"


class ExamRoom(models.Model):
    """Exam rooms"""
    room_id = models.AutoField(primary_key=True)
    room_number = models.CharField(max_length=20)
    building = models.CharField(max_length=100)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    facilities = models.JSONField(default=dict)  # {has_projector: true, has_AC: true}
    
    class Meta:
        db_table = 'exam_rooms'
    
    def __str__(self):
        return f"{self.building} - {self.room_number}"


class ExamSchedule(models.Model):
    """Exam schedules"""
    schedule_id = models.AutoField(primary_key=True)
    exam = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='schedules')
    exam_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.ForeignKey(ExamRoom, on_delete=models.CASCADE, related_name='exam_schedules')
    seating_plan = models.JSONField(default=dict)  # {seat_assignments: {student_id: seat_number}}
    invigilator = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='invigilated_exams')
    
    class Meta:
        db_table = 'exam_schedules'
    
    def __str__(self):
        return f"{self.exam} - {self.exam_date} - {self.start_time}"


class AdmitCard(models.Model):
    """Admit cards"""
    admit_card_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='admit_cards')
    exam = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='admit_cards')
    issued_date = models.DateField(default=timezone.now)
    seat_number = models.CharField(max_length=20, blank=True)
    qr_code_data = models.TextField(blank=True)
    is_downloaded = models.BooleanField(default=False)
    downloaded_at = models.DateTimeField(null=True, blank=True)
    eligibility_status = models.CharField(max_length=50, default='eligible')
    verification_log = models.JSONField(default=dict)  # {attempts: [{admin_id: int, timestamp: TIMESTAMP, result: string}]}
    
    class Meta:
        db_table = 'admit_cards'
        unique_together = ['student', 'exam']
    
    def __str__(self):
        return f"{self.student} - {self.exam}"


class ZoomClass(models.Model):
    """Zoom/virtual classes""""
    PLATFORM_CHOICES = [
        ('zoom', 'Zoom'),
        ('google_meet', 'Google Meet'),
    ]
    
    class_id = models.AutoField(primary_key=True)
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name='zoom_classes')
    topic = models.CharField(max_length=200)
    schedule_date = models.DateField()
    start_time = models.TimeField()
    duration_minutes = models.IntegerField(default=60)
    meeting_id = models.CharField(max_length=100, blank=True)
    join_link = models.TextField()
    recording_link = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by_faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='created_zoom_classes')
    created_at = models.DateTimeField(default=timezone.now)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES, default='zoom')
    start_url = models.TextField(blank=True)  # Host start link for faculty
    
    class Meta:
        db_table = 'zoom_classes'
    
    def __str__(self):
        return f"{self.topic} - {self.offering} - {self.schedule_date}"


class StudyMaterial(models.Model):
    """Study materials"""
    ACCESS_LEVEL_CHOICES = [
        ('enrolled_students', 'Enrolled Students'),
        ('public', 'Public'),
    ]
    
    material_id = models.AutoField(primary_key=True)
    offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name='study_materials')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file_url = models.URLField(max_length=500)
    file_type = models.CharField(max_length=50)  # pdf, ppt, video, link
    uploaded_by_faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='uploaded_materials')
    upload_date = models.DateTimeField(default=timezone.now)
    is_visible = models.BooleanField(default=True)
    access_level = models.CharField(max_length=50, choices=ACCESS_LEVEL_CHOICES, default='enrolled_students')
    
    class Meta:
        db_table = 'study_materials'
    
    def __str__(self):
        return f"{self.title} - {self.offering}"


class ResultPublication(models.Model):
    """Result publications"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    publication_id = models.AutoField(primary_key=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='result_publications')
    published_by_admin = models.ForeignKey(AcademicAdmin, on_delete=models.CASCADE, related_name='published_results')
    publish_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True)
    published_to_students_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'result_publications'
    
    def __str__(self):
        return f"Results - {self.semester} - {self.status}"


class Transcript(models.Model):
    """Transcripts"""
    transcript_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='transcripts')
    generated_date = models.DateField(default=timezone.now)
    issued_by_admin = models.ForeignKey(AcademicAdmin, on_delete=models.CASCADE, related_name='issued_transcripts')
    cumulative_gpa = models.DecimalField(max_digits=3, decimal_places=2)
    file_url = models.URLField(max_length=500)
    is_official = models.BooleanField(default=True)
    verification_hash = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'transcripts'
    
    def __str__(self):
        return f"Transcript - {self.student} - {self.generated_date}"


class TranscriptDetail(models.Model):
    """Transcript details (line items)"""
    detail_id = models.AutoField(primary_key=True)
    transcript = models.ForeignKey(Transcript, on_delete=models.CASCADE, related_name='details')
    course_code = models.CharField(max_length=20)
    course_name = models.CharField(max_length=200)
    credit_hours = models.IntegerField()
    grade = models.CharField(max_length=5)
    grade_points = models.DecimalField(max_digits=4, decimal_places=2)
    semester_name = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'transcript_details'
        verbose_name_plural = 'Transcript Details'
    
    def __str__(self):
        return f"{self.course_code} - {self.grade}"


class Notice(models.Model):
    """Noticeboard/announcements"""
    PRIORITY_CHOICES = [
        ('normal', 'Normal'),
        ('important', 'Important'),
        ('urgent', 'Urgent'),
    ]
    
    TARGET_AUDIENCE_CHOICES = [
        ('all', 'All'),
        ('students', 'Students'),
        ('faculty', 'Faculty'),
        ('specific_department', 'Specific Department'),
    ]
    
    notice_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    posted_by_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notices')
    post_date = models.DateTimeField(default=timezone.now)
    expiry_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    target_audience = models.CharField(max_length=50, choices=TARGET_AUDIENCE_CHOICES, default='all')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    is_pinned = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'notices'
        indexes = [
            models.Index(fields=['target_audience', 'post_date']),
        ]
    
    def __str__(self):
        return self.title


class AdmissionInquiry(models.Model):
    """Admission inquiries (from website form)"""
    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('event', 'Event'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('converted', 'Converted'),
        ('rejected', 'Rejected'),
    ]
    
    inquiry_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    program_interest = models.CharField(max_length=200, blank=True)
    inquiry_date = models.DateTimeField(default=timezone.now)
    source = models.CharField(max_length=100, choices=SOURCE_CHOICES, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='new')
    assigned_to_admin = models.ForeignKey(AcademicAdmin, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'admission_inquiries'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.program_interest}"


class Applicant(models.Model):
    """Formal applicants"""
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    applicant_id = models.AutoField(primary_key=True)
    inquiry = models.ForeignKey(AdmissionInquiry, on_delete=models.CASCADE, related_name='applications')
    application_number = models.CharField(max_length=50, unique=True)
    applied_date = models.DateField(default=timezone.now)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='applicants')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='submitted')
    documents = models.JSONField(default=dict)  # {transcript: 'url', recommendation: 'url'}
    remarks = models.TextField(blank=True)
    accepted_date = models.DateField(null=True, blank=True)
    accepted_by_admin = models.ForeignKey(AcademicAdmin, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'applicants'
    
    def __str__(self):
        return f"{self.application_number} - {self.inquiry.first_name} {self.inquiry.last_name}"