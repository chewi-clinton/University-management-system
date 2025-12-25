from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import (
    User, Faculty, Department, Program, Course, CoursePrerequisite,
    AcademicSession, Semester, Student, FacultyMember, AcademicAdmin,
    Enrollment, CourseOffering, StudentCourseRegistration,
    Attendance, AttendanceSummary, Grade, Examination,
    ExamRoom, ExamSchedule, AdmitCard, ZoomClass, StudyMaterial,
    ResultPublication, Transcript, TranscriptDetail, Notice,
    AdmissionInquiry, Applicant
)


class UserSerializer(serializers.ModelSerializer):
    """User serializer with role-based fields"""
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'password', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class FacultySerializer(serializers.ModelSerializer):
    """Academic Faculty (organization) serializer"""
    class Meta:
        model = Faculty
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    """Department serializer with nested faculty"""
    faculty_name = serializers.CharField(source='faculty.faculty_name', read_only=True)
    head_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['department_id', 'department_name', 'faculty', 'faculty_name', 
                 'head', 'head_name', 'department_code', 'office_location']
    
    def get_head_name(self, obj):
        if obj.head:
            return f"{obj.head.user.first_name} {obj.head.user.last_name}"
        return None


class FacultyMemberSerializer(serializers.ModelSerializer):
    """Faculty Member (professor/teacher) serializer"""
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='faculty'),
        source='user',
        write_only=True
    )
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        write_only=True
    )
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = FacultyMember
        fields = '__all__'
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class ProgramSerializer(serializers.ModelSerializer):
    """Program serializer with nested department"""
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        write_only=True
    )
    
    class Meta:
        model = Program
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    """Course serializer"""
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        write_only=True
    )
    
    class Meta:
        model = Course
        fields = '__all__'


class CoursePrerequisiteSerializer(serializers.ModelSerializer):
    """Course prerequisite serializer"""
    course = CourseSerializer(read_only=True)
    prerequisite_course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True
    )
    prerequisite_course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='prerequisite_course',
        write_only=True
    )
    
    class Meta:
        model = CoursePrerequisite
        fields = '__all__'


class AcademicSessionSerializer(serializers.ModelSerializer):
    """Academic session serializer"""
    class Meta:
        model = AcademicSession
        fields = '__all__'


class SemesterSerializer(serializers.ModelSerializer):
    """Semester serializer with nested session"""
    session = AcademicSessionSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(
        queryset=AcademicSession.objects.all(),
        source='session',
        write_only=True
    )
    
    class Meta:
        model = Semester
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    """Student serializer with nested relationships"""
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='student'),
        source='user',
        write_only=True
    )
    program = ProgramSerializer(read_only=True)
    program_id = serializers.PrimaryKeyRelatedField(
        queryset=Program.objects.all(),
        source='program',
        write_only=True
    )
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = '__all__'
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class StudentSummarySerializer(serializers.ModelSerializer):
    """Lightweight student serializer for listings"""
    full_name = serializers.SerializerMethodField()
    program_name = serializers.CharField(source='program.program_name', read_only=True)
    
    class Meta:
        model = Student
        fields = ['student_id', 'university_reg_number', 'full_name', 'program_name', 'current_status']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class AcademicAdminSerializer(serializers.ModelSerializer):
    """Academic admin serializer"""
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__in=['academic_admin', 'super_admin']),
        source='user',
        write_only=True
    )
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        write_only=True,
        allow_null=True
    )
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AcademicAdmin
        fields = '__all__'
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class EnrollmentSerializer(serializers.ModelSerializer):
    """Enrollment serializer with nested relationships"""
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source='student',
        write_only=True
    )
    semester = SemesterSerializer(read_only=True)
    semester_id = serializers.PrimaryKeyRelatedField(
        queryset=Semester.objects.all(),
        source='semester',
        write_only=True
    )
    confirmed_by_admin = AcademicAdminSerializer(read_only=True)
    confirmed_by_admin_id = serializers.PrimaryKeyRelatedField(
        queryset=AcademicAdmin.objects.all(),
        source='confirmed_by_admin',
        write_only=True,
        allow_null=True
    )
    
    class Meta:
        model = Enrollment
        fields = '__all__'


class CourseOfferingSerializer(serializers.ModelSerializer):
    """Course offering serializer"""
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True
    )
    semester = SemesterSerializer(read_only=True)
    semester_id = serializers.PrimaryKeyRelatedField(
        queryset=Semester.objects.all(),
        source='semester',
        write_only=True
    )
    faculty = FacultyMemberSerializer(read_only=True)
    faculty_id = serializers.PrimaryKeyRelatedField(
        queryset=FacultyMember.objects.all(),
        source='faculty',
        write_only=True
    )
    schedule_display = serializers.SerializerMethodField()
    
    class Meta:
        model = CourseOffering
        fields = '__all__'
    
    def get_schedule_display(self, obj):
        from .utils import format_schedule_for_display
        return format_schedule_for_display(obj.schedule)


class StudentCourseRegistrationSerializer(serializers.ModelSerializer):
    """Student course registration serializer"""
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source='student',
        write_only=True
    )
    offering = CourseOfferingSerializer(read_only=True)
    offering_id = serializers.PrimaryKeyRelatedField(
        queryset=CourseOffering.objects.all(),
        source='offering',
        write_only=True
    )
    enrollment = EnrollmentSerializer(read_only=True)
    enrollment_id = serializers.PrimaryKeyRelatedField(
        queryset=Enrollment.objects.all(),
        source='enrollment',
        write_only=True
    )
    
    class Meta:
        model = StudentCourseRegistration
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    """Attendance serializer"""
    student = StudentSummarySerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source='student',
        write_only=True
    )
    offering = CourseOfferingSerializer(read_only=True)
    offering_id = serializers.PrimaryKeyRelatedField(
        queryset=CourseOffering.objects.all(),
        source='offering',
        write_only=True
    )
    marked_by_faculty = FacultyMemberSerializer(read_only=True)
    marked_by_faculty_id = serializers.PrimaryKeyRelatedField(
        queryset=FacultyMember.objects.all(),
        source='marked_by_faculty',
        write_only=True
    )
    
    class Meta:
        model = Attendance
        fields = '__all__'


class AttendanceSummarySerializer(serializers.ModelSerializer):
    """Attendance summary serializer"""
    student = StudentSummarySerializer(read_only=True)
    offering = CourseOfferingSerializer(read_only=True)
    
    class Meta:
        model = AttendanceSummary
        fields = '__all__'


class GradeSerializer(serializers.ModelSerializer):
    """Grade serializer"""
    student = StudentSummarySerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source='student',
        write_only=True
    )
    offering = CourseOfferingSerializer(read_only=True)
    offering_id = serializers.PrimaryKeyRelatedField(
        queryset=CourseOffering.objects.all(),
        source='offering',
        write_only=True
    )
    graded_by_faculty = FacultyMemberSerializer(read_only=True)
    graded_by_faculty_id = serializers.PrimaryKeyRelatedField(
        queryset=FacultyMember.objects.all(),
        source='graded_by_faculty',
        write_only=True
    )
    
    class Meta:
        model = Grade
        fields = '__all__'


class ExaminationSerializer(serializers.ModelSerializer):
    """Examination serializer"""
    offering = CourseOfferingSerializer(read_only=True)
    offering_id = serializers.PrimaryKeyRelatedField(
        queryset=CourseOffering.objects.all(),
        source='offering',
        write_only=True
    )
    
    class Meta:
        model = Examination
        fields = '__all__'


class ExamRoomSerializer(serializers.ModelSerializer):
    """Exam room serializer"""
    class Meta:
        model = ExamRoom
        fields = '__all__'


class ExamScheduleSerializer(serializers.ModelSerializer):
    """Exam schedule serializer"""
    exam = ExaminationSerializer(read_only=True)
    exam_id = serializers.PrimaryKeyRelatedField(
        queryset=Examination.objects.all(),
        source='exam',
        write_only=True
    )
    room = ExamRoomSerializer(read_only=True)
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=ExamRoom.objects.all(),
        source='room',
        write_only=True
    )
    invigilator = FacultyMemberSerializer(read_only=True)
    invigilator_id = serializers.PrimaryKeyRelatedField(
        queryset=FacultyMember.objects.all(),
        source='invigilator',
        write_only=True
    )
    
    class Meta:
        model = ExamSchedule
        fields = '__all__'


class AdmitCardSerializer(serializers.ModelSerializer):
    """Admit card serializer"""
    student = StudentSummarySerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source='student',
        write_only=True
    )
    exam = ExaminationSerializer(read_only=True)
    exam_id = serializers.PrimaryKeyRelatedField(
        queryset=Examination.objects.all(),
        source='exam',
        write_only=True
    )
    
    class Meta:
        model = AdmitCard
        fields = '__all__'


class ZoomClassSerializer(serializers.ModelSerializer):
    """Zoom class serializer"""
    offering = CourseOfferingSerializer(read_only=True)
    offering_id = serializers.PrimaryKeyRelatedField(
        queryset=CourseOffering.objects.all(),
        source='offering',
        write_only=True
    )
    created_by_faculty = FacultyMemberSerializer(read_only=True)
    created_by_faculty_id = serializers.PrimaryKeyRelatedField(
        queryset=FacultyMember.objects.all(),
        source='created_by_faculty',
        write_only=True
    )
    
    class Meta:
        model = ZoomClass
        fields = '__all__'


class StudyMaterialSerializer(serializers.ModelSerializer):
    """Study material serializer"""
    offering = CourseOfferingSerializer(read_only=True)
    offering_id = serializers.PrimaryKeyRelatedField(
        queryset=CourseOffering.objects.all(),
        source='offering',
        write_only=True
    )
    uploaded_by_faculty = FacultyMemberSerializer(read_only=True)
    uploaded_by_faculty_id = serializers.PrimaryKeyRelatedField(
        queryset=FacultyMember.objects.all(),
        source='uploaded_by_faculty',
        write_only=True
    )
    
    class Meta:
        model = StudyMaterial
        fields = '__all__'


class ResultPublicationSerializer(serializers.ModelSerializer):
    """Result publication serializer"""
    semester = SemesterSerializer(read_only=True)
    semester_id = serializers.PrimaryKeyRelatedField(
        queryset=Semester.objects.all(),
        source='semester',
        write_only=True
    )
    published_by_admin = AcademicAdminSerializer(read_only=True)
    published_by_admin_id = serializers.PrimaryKeyRelatedField(
        queryset=AcademicAdmin.objects.all(),
        source='published_by_admin',
        write_only=True
    )
    
    class Meta:
        model = ResultPublication
        fields = '__all__'


class TranscriptDetailSerializer(serializers.ModelSerializer):
    """Transcript detail serializer"""
    class Meta:
        model = TranscriptDetail
        fields = '__all__'


class TranscriptSerializer(serializers.ModelSerializer):
    """Transcript serializer with nested details"""
    student = StudentSummarySerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source='student',
        write_only=True
    )
    issued_by_admin = AcademicAdminSerializer(read_only=True)
    issued_by_admin_id = serializers.PrimaryKeyRelatedField(
        queryset=AcademicAdmin.objects.all(),
        source='issued_by_admin',
        write_only=True
    )
    details = TranscriptDetailSerializer(many=True, read_only=True)
    
    class Meta:
        model = Transcript
        fields = '__all__'


class NoticeSerializer(serializers.ModelSerializer):
    """Notice serializer"""
    posted_by_user = UserSerializer(read_only=True)
    posted_by_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='posted_by_user',
        write_only=True
    )
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        write_only=True,
        allow_null=True
    )
    
    class Meta:
        model = Notice
        fields = '__all__'


class AdmissionInquirySerializer(serializers.ModelSerializer):
    """Admission inquiry serializer"""
    assigned_to_admin = AcademicAdminSerializer(read_only=True)
    assigned_to_admin_id = serializers.PrimaryKeyRelatedField(
        queryset=AcademicAdmin.objects.all(),
        source='assigned_to_admin',
        write_only=True,
        allow_null=True
    )
    
    class Meta:
        model = AdmissionInquiry
        fields = '__all__'


class ApplicantSerializer(serializers.ModelSerializer):
    """Applicant serializer"""
    inquiry = AdmissionInquirySerializer(read_only=True)
    inquiry_id = serializers.PrimaryKeyRelatedField(
        queryset=AdmissionInquiry.objects.all(),
        source='inquiry',
        write_only=True
    )
    program = ProgramSerializer(read_only=True)
    program_id = serializers.PrimaryKeyRelatedField(
        queryset=Program.objects.all(),
        source='program',
        write_only=True
    )
    accepted_by_admin = AcademicAdminSerializer(read_only=True)
    accepted_by_admin_id = serializers.PrimaryKeyRelatedField(
        queryset=AcademicAdmin.objects.all(),
        source='accepted_by_admin',
        write_only=True,
        allow_null=True
    )
    
    class Meta:
        model = Applicant
        fields = '__all__'


# Custom serializers for specific actions
class QRAttendanceSerializer(serializers.Serializer):
    """Serializer for QR attendance marking"""
    student_id = serializers.IntegerField()
    offering_id = serializers.IntegerField()
    qr_token = serializers.CharField()
    attendance_date = serializers.DateField(default=timezone.now)
    
    def validate(self, data):
        from .utils import decrypt_qr_payload
        
        # Validate QR token
        decrypted_payload = decrypt_qr_payload(data['qr_token'])
        if not decrypted_payload:
            raise ValidationError("Invalid or expired QR code")
        
        # Check if student is enrolled in the course
        from .models import StudentCourseRegistration
        if not StudentCourseRegistration.objects.filter(
            student_id=data['student_id'],
            offering_id=data['offering_id'],
            status='registered'
        ).exists():
            raise ValidationError("Student not enrolled in this course")
        
        return data


class ZoomMeetingSerializer(serializers.Serializer):
    """Serializer for creating Zoom meetings"""
    topic = serializers.CharField(required=True)
    schedule_date = serializers.DateField(required=True)
    start_time = serializers.TimeField(required=True)
    duration_minutes = serializers.IntegerField(default=60)
    offering_id = serializers.IntegerField(required=True)
    
    def validate_offering_id(self, value):
        from .models import CourseOffering
        if not CourseOffering.objects.filter(id=value).exists():
            raise ValidationError("Course offering not found")
        return value


class GPAReportSerializer(serializers.Serializer):
    """Serializer for GPA calculation report"""
    student_id = serializers.IntegerField()
    semester_id = serializers.IntegerField(required=False)
    
    def validate(self, data):
        from .models import Student
        if not Student.objects.filter(id=data['student_id']).exists():
            raise ValidationError("Student not found")
        return data