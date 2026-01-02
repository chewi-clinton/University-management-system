from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.models import Group
from unfold.admin import ModelAdmin
from unfold.decorators import display
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from .models import (
    User, Faculty, Department, Program, Course, CoursePrerequisite,
    AcademicSession, Semester, Student, FacultyMember, AcademicAdmin,
    Enrollment, CourseOffering, StudentCourseRegistration,
    Attendance, AttendanceSummary, Grade, Examination,
    ExamRoom, ExamSchedule, AdmitCard, ZoomClass, StudyMaterial,
    ResultPublication, Transcript, TranscriptDetail, Notice,
    AdmissionInquiry, Applicant
)

admin.site.unregister(Group)

@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active_badge', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']
   
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'created_at')}),
    )
   
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )
    
    @display(boolean=True, description="Active")
    def is_active_badge(self, obj):
        return obj.is_active

@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass

@admin.register(Faculty)
class FacultyAdmin(ModelAdmin):
    list_display = ['faculty_name', 'faculty_code', 'dean']
    search_fields = ['faculty_name', 'faculty_code']

@admin.register(Department)
class DepartmentAdmin(ModelAdmin):
    list_display = ['department_name', 'faculty', 'department_code', 'head']
    list_filter = ['faculty']
    search_fields = ['department_name', 'department_code']

@admin.register(Program)
class ProgramAdmin(ModelAdmin):
    list_display = ['program_name', 'department', 'program_code', 'program_type', 'duration_years']
    list_filter = ['program_type', 'department']
    search_fields = ['program_name', 'program_code']

@admin.register(Course)
class CourseAdmin(ModelAdmin):
    list_display = ['course_code', 'course_name', 'department', 'credit_hours', 'is_elective_badge']
    list_filter = ['is_elective', 'department']
    search_fields = ['course_code', 'course_name']
    
    @display(boolean=True, description="Elective")
    def is_elective_badge(self, obj):
        return obj.is_elective

@admin.register(CoursePrerequisite)
class CoursePrerequisiteAdmin(ModelAdmin):
    list_display = ['course', 'prerequisite_course', 'is_mandatory_badge']
    search_fields = ['course__course_code', 'prerequisite_course__course_code']
    
    @display(boolean=True, description="Mandatory")
    def is_mandatory_badge(self, obj):
        return obj.is_mandatory

@admin.register(AcademicSession)
class AcademicSessionAdmin(ModelAdmin):
    list_display = ['session_name', 'academic_year', 'start_date', 'end_date', 'is_active_badge', 'is_archived_badge']
    list_filter = ['is_active', 'is_archived', 'academic_year']
    search_fields = ['session_name']
    
    @display(boolean=True, description="Active")
    def is_active_badge(self, obj):
        return obj.is_active
    
    @display(boolean=True, description="Archived")
    def is_archived_badge(self, obj):
        return obj.is_archived

@admin.register(Semester)
class SemesterAdmin(ModelAdmin):
    list_display = ['semester_name', 'session', 'semester_number', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'session']
    search_fields = ['semester_name']

@admin.register(Student)
class StudentAdmin(ModelAdmin):
    list_display = ['university_reg_number', 'first_name', 'last_name', 'program', 'current_status', 'enrollment_date']
    list_filter = ['current_status', 'program', 'enrollment_date']
    search_fields = ['university_reg_number', 'first_name', 'last_name', 'user__email']
   
    def email(self, obj):
        return obj.user.email

@admin.register(FacultyMember)
class FacultyMemberAdmin(ModelAdmin):
    list_display = ['employee_id', 'user', 'department', 'designation', 'hire_date']
    list_filter = ['department', 'hire_date']
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'user__email']

@admin.register(AcademicAdmin)
class AcademicAdminAdmin(ModelAdmin):
    list_display = ['user', 'department']
    list_filter = ['department']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']

@admin.register(Enrollment)
class EnrollmentAdmin(ModelAdmin):
    list_display = ['enrollment_number', 'student', 'semester', 'status', 'enrollment_date']
    list_filter = ['status', 'semester', 'enrollment_date']
    search_fields = ['enrollment_number', 'student__university_reg_number', 'student__first_name']

@admin.register(CourseOffering)
class CourseOfferingAdmin(ModelAdmin):
    list_display = ['offering_id', 'course', 'semester', 'faculty', 'section', 'current_enrollment', 'max_students', 'is_visible_badge']
    list_filter = ['semester', 'course__department', 'is_visible']
    search_fields = ['course__course_code', 'course__course_name', 'faculty__user__first_name']
    
    @display(boolean=True, description="Visible")
    def is_visible_badge(self, obj):
        return obj.is_visible

@admin.register(StudentCourseRegistration)
class StudentCourseRegistrationAdmin(ModelAdmin):
    list_display = ['registration_id', 'student', 'offering', 'status', 'grade', 'grade_points']
    list_filter = ['status', 'grade', 'offering__semester']
    search_fields = ['student__university_reg_number', 'student__first_name', 'offering__course__course_code']

@admin.register(Attendance)
class AttendanceAdmin(ModelAdmin):
    list_display = ['attendance_id', 'student', 'offering', 'attendance_date', 'status', 'marked_by_faculty']
    list_filter = ['status', 'attendance_date', 'offering__course__department']
    search_fields = ['student__university_reg_number', 'student__first_name']

@admin.register(AttendanceSummary)
class AttendanceSummaryAdmin(ModelAdmin):
    list_display = ['summary_id', 'student', 'offering', 'attendance_percentage', 'warning_sent_badge', 'last_updated']
    list_filter = ['warning_sent', 'last_updated']
    search_fields = ['student__university_reg_number', 'student__first_name']
    
    @display(boolean=True, description="Warning Sent")
    def warning_sent_badge(self, obj):
        return obj.warning_sent

@admin.register(Grade)
class GradeAdmin(ModelAdmin):
    list_display = ['grade_id', 'student', 'offering', 'assessment_name', 'marks_obtained', 'max_marks', 'weightage', 'is_finalized_badge']
    list_filter = ['assessment_type', 'is_finalized', 'graded_at']
    search_fields = ['student__university_reg_number', 'student__first_name', 'offering__course__course_code', 'assessment_name']
    readonly_fields = ['graded_at']
    
    @display(boolean=True, description="Finalized")
    def is_finalized_badge(self, obj):
        return obj.is_finalized

@admin.register(Examination)
class ExaminationAdmin(ModelAdmin):
    list_display = ['exam_id', 'exam_name', 'offering', 'exam_type', 'total_marks', 'weightage']
    list_filter = ['exam_type', 'offering__semester']
    search_fields = ['exam_name', 'offering__course__course_code']

@admin.register(ExamRoom)
class ExamRoomAdmin(ModelAdmin):
    list_display = ['room_id', 'room_number', 'building', 'capacity']
    list_filter = ['building']
    search_fields = ['room_number', 'building']

@admin.register(ExamSchedule)
class ExamScheduleAdmin(ModelAdmin):
    list_display = ['schedule_id', 'exam', 'exam_date', 'start_time', 'end_time', 'room', 'invigilator']
    list_filter = ['exam_date', 'exam__exam_type']
    search_fields = ['exam__exam_name', 'room__room_number']

@admin.register(AdmitCard)
class AdmitCardAdmin(ModelAdmin):
    list_display = ['admit_card_id', 'student', 'exam', 'issued_date', 'eligibility_status', 'is_downloaded_badge']
    list_filter = ['eligibility_status', 'is_downloaded', 'issued_date']
    search_fields = ['student__university_reg_number', 'exam__exam_name']
    
    @display(boolean=True, description="Downloaded")
    def is_downloaded_badge(self, obj):
        return obj.is_downloaded

@admin.register(ZoomClass)
class ZoomClassAdmin(ModelAdmin):
    list_display = ['class_id', 'topic', 'offering', 'schedule_date', 'start_time', 'platform', 'is_active_badge']
    list_filter = ['platform', 'is_active', 'schedule_date']
    search_fields = ['topic', 'offering__course__course_code']
    
    @display(boolean=True, description="Active")
    def is_active_badge(self, obj):
        return obj.is_active

@admin.register(StudyMaterial)
class StudyMaterialAdmin(ModelAdmin):
    list_display = [
        'id',  # Changed from 'material_id' to 'id' (Django's default PK)
        'title',
        'offering',
        'uploaded_by_faculty',
        'uploaded_at',
        'file_type',
        'access_level',
        'is_visible_badge',
        'download_count',
        'view_count'
    ]
    list_filter = [
        'file_type',
        'access_level',
        'is_visible',
        'uploaded_at',
        'offering__course__department',
        'offering__semester'
    ]
    search_fields = ['title', 'description', 'tags', 'offering__course__course_code']
    autocomplete_fields = ['offering', 'uploaded_by_faculty']
    date_hierarchy = 'uploaded_at'

    @display(boolean=True, description="Visible")
    def is_visible_badge(self, obj):
        return obj.is_visible

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related(
            'offering__course',
            'offering__semester',
            'uploaded_by_faculty__user'
        )

@admin.register(ResultPublication)
class ResultPublicationAdmin(ModelAdmin):
    list_display = ['publication_id', 'semester', 'status', 'publish_date', 'published_by_admin']
    list_filter = ['status', 'publish_date']
    search_fields = ['semester__semester_name', 'semester__session__session_name']

@admin.register(Transcript)
class TranscriptAdmin(ModelAdmin):
    list_display = ['transcript_id', 'student', 'generated_date', 'cumulative_gpa', 'is_official_badge']
    list_filter = ['is_official', 'generated_date']
    search_fields = ['student__university_reg_number', 'student__first_name']
    
    @display(boolean=True, description="Official")
    def is_official_badge(self, obj):
        return obj.is_official

@admin.register(TranscriptDetail)
class TranscriptDetailAdmin(ModelAdmin):
    list_display = ['detail_id', 'transcript', 'course_code', 'grade', 'grade_points']
    search_fields = ['course_code', 'transcript__student__university_reg_number']

@admin.register(Notice)
class NoticeAdmin(ModelAdmin):
    list_display = ['notice_id', 'title', 'priority', 'target_audience', 'post_date', 'expiry_date', 'is_pinned_badge']
    list_filter = ['priority', 'target_audience', 'is_pinned', 'post_date']
    search_fields = ['title', 'content']
    
    @display(boolean=True, description="Pinned")
    def is_pinned_badge(self, obj):
        return obj.is_pinned

@admin.register(AdmissionInquiry)
class AdmissionInquiryAdmin(ModelAdmin):
    list_display = ['inquiry_id', 'first_name', 'last_name', 'email', 'program_interest', 'status', 'inquiry_date']
    list_filter = ['status', 'source', 'inquiry_date']
    search_fields = ['first_name', 'last_name', 'email', 'program_interest']

@admin.register(Applicant)
class ApplicantAdmin(ModelAdmin):
    list_display = ['applicant_id', 'application_number', 'inquiry', 'program', 'status', 'applied_date']
    list_filter = ['status', 'program', 'applied_date']
    search_fields = ['application_number', 'inquiry__first_name', 'inquiry__last_name']