import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Avg
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
import qrcode
from io import BytesIO
from PIL import Image
import base64

from .models import (
    User, Faculty, Department, Program, Course, CoursePrerequisite,
    AcademicSession, Semester, Student, FacultyMember, AcademicAdmin,
    Enrollment, CourseOffering, StudentCourseRegistration,
    Attendance, AttendanceSummary, Grade, Examination,
    ExamRoom, ExamSchedule, AdmitCard, ZoomClass, StudyMaterial,
    ResultPublication, Transcript, TranscriptDetail, Notice,
    AdmissionInquiry, Applicant
)
from .serializers import (
    UserSerializer, FacultyMemberSerializer, DepartmentSerializer, ProgramSerializer,
    CourseSerializer, CoursePrerequisiteSerializer, AcademicSessionSerializer,
    SemesterSerializer, StudentSerializer, StudentSummarySerializer,
    AcademicAdminSerializer, EnrollmentSerializer,
    CourseOfferingSerializer, StudentCourseRegistrationSerializer,
    AttendanceSerializer, AttendanceSummarySerializer, GradeSerializer,
    ExaminationSerializer, ExamRoomSerializer, ExamScheduleSerializer,
    AdmitCardSerializer, ZoomClassSerializer, StudyMaterialSerializer,
    ResultPublicationSerializer, TranscriptSerializer, NoticeSerializer,
    AdmissionInquirySerializer, ApplicantSerializer,
    QRAttendanceSerializer, ZoomMeetingSerializer, GPAReportSerializer
)
from .permissions import (
    IsSuperAdmin, IsAcademicAdmin, IsFaculty, IsStudent,
    IsFacultyOrAdmin, IsStudentOrAdmin, IsOwnerOrAdmin,
    IsEnrolledStudent, CanMarkAttendance, CanViewGrades,
    CanModifyGrades, CanCreateExams, CanViewExamDetails,
    CanManageZoomClasses, CanUploadMaterials, CanViewMaterials,
    CanManageNotices, CanManageAdmissions, CanViewAdmissions,
    CanGenerateReports
)
from .utils import encrypt_qr_payload, decrypt_qr_payload, calculate_gpa, grade_to_grade_points, is_eligible_for_exam
from .integrations.zoom import create_zoom_class, delete_zoom_meeting
from .integrations.google_meet import create_google_meet_class
from .integrations.notifications import (
    send_student_admission_confirmation,
    send_attendance_warning,
    send_result_notification,
    send_class_reminder
)

logger = logging.getLogger(__name__)

class CanViewNotices(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        user = request.user
        if user.role in ['super_admin', 'academic_admin', 'faculty', 'student']:
            return True
        return False

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email']
    ordering = ['-created_at']

class FacultyMemberViewSet(viewsets.ModelViewSet):
    queryset = FacultyMember.objects.select_related('user', 'department').all()
    serializer_class = FacultyMemberSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'designation']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'employee_id']
    ordering_fields = ['hire_date', 'user__first_name']

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.select_related('faculty', 'head').all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['faculty']
    search_fields = ['department_name', 'department_code']

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.select_related('department').all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['department', 'program_type']
    search_fields = ['program_name', 'program_code']

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('department').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['department', 'is_elective', 'credit_hours']
    search_fields = ['course_code', 'course_name']

class CoursePrerequisiteViewSet(viewsets.ModelViewSet):
    queryset = CoursePrerequisite.objects.select_related('course', 'prerequisite_course').all()
    serializer_class = CoursePrerequisiteSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]

class AcademicSessionViewSet(viewsets.ModelViewSet):
    queryset = AcademicSession.objects.all()
    serializer_class = AcademicSessionSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['is_active', 'is_archived']
    ordering_fields = ['start_date', 'academic_year']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAcademicAdmin])
    def activate(self, request, pk=None):
        session = self.get_object()
        AcademicSession.objects.filter(is_active=True).update(is_active=False)
        session.is_active = True
        session.save()
        return Response({'status': 'Session activated successfully'})

class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.select_related('session').all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['session', 'status']
    ordering_fields = ['start_date', 'semester_number']

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related('user', 'program').all()
    serializer_class = StudentSerializer
    # CRITICAL FIX: Changed from [IsAuthenticated, IsFacultyOrAdmin] to just [IsAuthenticated]
    permission_classes = [IsAuthenticated] # <-- This is the key change!
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['program', 'current_status', 'enrollment_date']
    search_fields = ['university_reg_number', 'first_name', 'last_name', 'user__email']
    ordering_fields = ['enrollment_date', 'first_name', 'current_gpa']
    def get_serializer_class(self):
        if self.action == 'list':
            return StudentSummarySerializer
        return StudentSerializer
    def get_permissions(self):
        """
        Customize permissions per action:
        - Students can access: list (own record), me, dashboard, transcript, attendance_summary
        - Faculty/Admin can access: everything
        """
        # Allow students to access these specific actions
        if self.action in ['list', 'me', 'dashboard', 'transcript', 'attendance_summary']:
            return [IsAuthenticated()]
       
        # All other actions (create, update, delete, retrieve) require Faculty or Admin
        return [IsAuthenticated(), IsFacultyOrAdmin()]
    def get_queryset(self):
        """
        Filter queryset based on user role:
        - Students can only see their own record
        - Faculty/Admin can see all students
        """
        queryset = super().get_queryset()
        user = self.request.user
       
        # If student, only show their own record
        if user.role == 'student':
            return queryset.filter(user=user)
       
        # Faculty and admin can see all
        return queryset
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current student's profile"""
        try:
            student = Student.objects.select_related('program').get(user=request.user)
            serializer = StudentSerializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response(
                {'detail': 'Student profile not found for the authenticated user.'},
                status=status.HTTP_404_NOT_FOUND
            )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def dashboard(self, request):
        """
        Student dashboard endpoint - accessible by any authenticated student
        GET /api/students/dashboard/
        """
        logger.info(f"Dashboard accessed by: {request.user.email} (role: {request.user.role})")
       
        try:
            student = Student.objects.select_related('program', 'user').get(user=request.user)
        except Student.DoesNotExist:
            return Response(
                {'detail': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        # Get registered courses count
        registered_courses = StudentCourseRegistration.objects.filter(
            student=student,
            status='registered'
        ).count()
        # Build stats
        stats = {
            'totalCourses': registered_courses,
            'currentGPA': float(student.current_gpa) if student.current_gpa else 0.0,
            'attendancePercentage': 0,
            'pendingAssignments': 0,
        }
        today_schedule = []
        upcoming_deadlines = []
        # Get recent notices
        recent_notices = Notice.objects.filter(
            Q(target_audience='all') |
            Q(target_audience='students') |
            Q(target_audience='specific_department', department=student.program.department)
        ).order_by('-post_date')[:5]
        serializer = NoticeSerializer(recent_notices, many=True)
        logger.info(f"Dashboard data compiled successfully for {student.first_name} {student.last_name}")
        return Response({
            'stats': stats,
            'todaySchedule': today_schedule,
            'upcomingDeadlines': upcoming_deadlines,
            'recentNotices': serializer.data,
        })
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, IsStudentOrAdmin])
    def transcript(self, request, pk=None):
        student = self.get_object()
       
        if request.user.role == 'student' and student.user != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
       
        transcripts = Transcript.objects.filter(student=student).order_by('-generated_date')
        serializer = TranscriptSerializer(transcripts, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, IsStudentOrAdmin])
    def attendance_summary(self, request, pk=None):
        student = self.get_object()
       
        if request.user.role == 'student' and student.user != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
       
        attendance_summaries = AttendanceSummary.objects.filter(student=student)
        serializer = AttendanceSummarySerializer(attendance_summaries, many=True)
        return Response(serializer.data)

class AcademicAdminViewSet(viewsets.ModelViewSet):
    queryset = AcademicAdmin.objects.select_related('user', 'department').all()
    serializer_class = AcademicAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['department']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related('student', 'semester', 'confirmed_by_admin').all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['semester', 'status']
    search_fields = ['enrollment_number', 'student__university_reg_number', 'student__first_name']
    ordering_fields = ['enrollment_date', 'semester__start_date']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAcademicAdmin])
    def confirm(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.status = 'confirmed'
        enrollment.confirmed_by_admin = request.user.admin_profile
        enrollment.confirmed_at = timezone.now()
        enrollment.save()
        return Response({'status': 'Enrollment confirmed'})

class CourseOfferingViewSet(viewsets.ModelViewSet):
    queryset = CourseOffering.objects.select_related('course', 'semester', 'faculty').all()
    serializer_class = CourseOfferingSerializer
    permission_classes = [IsAuthenticated, IsFacultyOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['semester', 'faculty', 'course__department', 'is_visible']
    search_fields = ['course__course_code', 'course__course_name', 'section']
    ordering_fields = ['semester__start_date', 'course__course_code']

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, IsEnrolledStudent])
    def materials(self, request, pk=None):
        offering = self.get_object()
        materials = StudyMaterial.objects.filter(offering=offering, is_visible=True)
        serializer = StudyMaterialSerializer(materials, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, IsEnrolledStudent])
    def zoom_classes(self, request, pk=None):
        offering = self.get_object()
        zoom_classes = ZoomClass.objects.filter(offering=offering, is_active=True)
        serializer = ZoomClassSerializer(zoom_classes, many=True)
        return Response(serializer.data)

class StudentCourseRegistrationViewSet(viewsets.ModelViewSet):
    queryset = StudentCourseRegistration.objects.select_related('student', 'offering', 'enrollment').all()
    serializer_class = StudentCourseRegistrationSerializer
    permission_classes = [IsAuthenticated, IsFacultyOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['offering__semester', 'status', 'grade']
    search_fields = ['student__university_reg_number', 'student__first_name', 'offering__course__course_code']
    def get_permissions(self):
        """
        Allow students to access their own courses via the my_courses action
        """
        if self.action == 'my_courses':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsFacultyOrAdmin()]
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_courses(self, request):
        """
        Get current student's course registrations
        GET /api/course-registrations/my-courses/
        """
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response(
                {'detail': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
       
        # Get all course registrations for this student
        registrations = StudentCourseRegistration.objects.filter(
            student=student
        ).select_related(
            'offering__course',
            'offering__semester',
            'offering__faculty__user',
            'enrollment'
        ).order_by('-offering__semester__start_date')
       
        serializer = StudentCourseRegistrationSerializer(registrations, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsFacultyOrAdmin])
    def withdraw(self, request, pk=None):
        registration = self.get_object()
        registration.status = 'withdrawn'
        registration.save()
        offering = registration.offering
        offering.current_enrollment = max(0, offering.current_enrollment - 1)
        offering.save()
        return Response({'status': 'Course withdrawn'})

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('student', 'offering', 'marked_by_faculty').all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, CanMarkAttendance]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['offering', 'attendance_date', 'status']
    search_fields = ['student__university_reg_number', 'student__first_name']
    ordering_fields = ['attendance_date', 'marked_at']
    def get_permissions(self):
        """
        Allow students to access their own attendance records via my_attendance action
        """
        if self.action == 'my_attendance':
            return [IsAuthenticated()]
        return [IsAuthenticated(), CanMarkAttendance()]
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_attendance(self, request):
        """
        Get current student's attendance records
        GET /api/attendance/my-attendance/
        """
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response(
                {'detail': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
       
        # Get all attendance records for this student
        attendance_records = Attendance.objects.filter(
            student=student
        ).select_related(
            'offering__course',
            'offering__semester',
            'marked_by_faculty__user'
        ).order_by('-attendance_date')
       
        # Apply filters if provided
        offering_id = request.query_params.get('offering')
        if offering_id:
            attendance_records = attendance_records.filter(offering_id=offering_id)
       
        attendance_date = request.query_params.get('attendance_date')
        if attendance_date:
            attendance_records = attendance_records.filter(attendance_date=attendance_date)
       
        status_filter = request.query_params.get('status')
        if status_filter:
            attendance_records = attendance_records.filter(status=status_filter)
       
        serializer = AttendanceSerializer(attendance_records, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, CanMarkAttendance])
    def mark_by_qr(self, request):
        serializer = QRAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            existing_attendance = Attendance.objects.filter(
                student_id=data['student_id'],
                offering_id=data['offering_id'],
                attendance_date=data['attendance_date']
            ).first()
            if existing_attendance:
                return Response({'error': 'Attendance already marked for today'},
                                status=status.HTTP_400_BAD_REQUEST)
            attendance = Attendance.objects.create(
                student_id=data['student_id'],
                offering_id=data['offering_id'],
                attendance_date=data['attendance_date'],
                status='present',
                marked_by_faculty=request.user.faculty_profile,
                qr_token=data['qr_token'],
                scanned_at=timezone.now()
            )
            attendance_serializer = AttendanceSerializer(attendance)
            return Response(attendance_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsFaculty])
    def generate_qr(self, request):
        offering_id = request.data.get('offering_id')
        attendance_date = request.data.get('attendance_date', timezone.now().date())
        payload = f"ATTENDANCE|{offering_id}|{attendance_date}"
        encrypted_payload = encrypt_qr_payload(payload)
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(encrypted_payload)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return Response({
            'qr_code': f"data:image/png;base64,{img_str}",
            'payload': encrypted_payload,
            'expires_at': timezone.now() + timezone.timedelta(minutes=5)
        })

class AttendanceSummaryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AttendanceSummary.objects.select_related('student', 'offering').all()
    serializer_class = AttendanceSummarySerializer
    permission_classes = [IsAuthenticated, CanViewGrades]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['student', 'offering', 'warning_sent']
    search_fields = ['student__university_reg_number', 'student__first_name']

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.select_related('student', 'offering', 'graded_by_faculty').all()
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated, CanViewGrades]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    # Fixed: Removed 'grade' from filterset_fields as it's not in the Grade model
    filterset_fields = ['offering', 'assessment_type', 'is_finalized']
    search_fields = ['student__university_reg_number', 'student__first_name', 'assessment_name']
    ordering_fields = ['graded_at', 'marks_obtained']
    def get_permissions(self):
        """
        Allow students to access their own grades via my_grades action
        """
        if self.action == 'my_grades':
            return [IsAuthenticated()]
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), CanModifyGrades()]
        return [IsAuthenticated(), CanViewGrades()]
    def get_queryset(self):
        """
        Filter queryset based on user role:
        - Students can only see their own grades
        - Faculty can see grades for courses they teach
        - Admins can see all grades
        """
        queryset = super().get_queryset()
        user = self.request.user
       
        # If student, only show their own grades
        if user.role == 'student':
            try:
                student = user.student_profile
                return queryset.filter(student=student)
            except:
                return queryset.none()
       
        # If faculty, show grades for courses they teach
        if user.role == 'faculty':
            try:
                faculty = user.faculty_profile
                return queryset.filter(offering__faculty=faculty)
            except:
                return queryset.none()
       
        # Admins can see all
        return queryset
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_grades(self, request):
        """
        Get current student's grades
        GET /api/grades/my-grades/
        """
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response(
                {'detail': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
       
        # Get all grades for this student
        grades = Grade.objects.filter(
            student=student
        ).select_related(
            'offering__course',
            'offering__semester',
            'graded_by_faculty__user'
        ).order_by('-graded_at')
       
        # Apply filters if provided
        offering_id = request.query_params.get('offering')
        if offering_id:
            grades = grades.filter(offering_id=offering_id)
       
        assessment_type = request.query_params.get('assessment_type')
        if assessment_type:
            grades = grades.filter(assessment_type=assessment_type)
       
        is_finalized = request.query_params.get('is_finalized')
        if is_finalized is not None:
            grades = grades.filter(is_finalized=is_finalized.lower() == 'true')
       
        serializer = GradeSerializer(grades, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanModifyGrades])
    def finalize(self, request, pk=None):
        grade = self.get_object()
        grade.is_finalized = True
        grade.save()
        return Response({'status': 'Grade finalized'})

class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.select_related('offering').all()
    serializer_class = ExaminationSerializer
    permission_classes = [IsAuthenticated, CanViewExamDetails]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['offering__semester', 'exam_type']
    search_fields = ['exam_name', 'offering__course__course_code']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), CanCreateExams()]
        return [IsAuthenticated(), CanViewExamDetails()]

class ExamRoomViewSet(viewsets.ModelViewSet):
    queryset = ExamRoom.objects.all()
    serializer_class = ExamRoomSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['building']
    search_fields = ['room_number', 'building']

class ExamScheduleViewSet(viewsets.ModelViewSet):
    queryset = ExamSchedule.objects.select_related('exam', 'room', 'invigilator').all()
    serializer_class = ExamScheduleSerializer
    permission_classes = [IsAuthenticated, IsFacultyOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['exam__exam_type', 'room', 'invigilator']
    search_fields = ['exam__exam_name', 'room__room_number']
    ordering_fields = ['exam_date', 'start_time']

class AdmitCardViewSet(viewsets.ModelViewSet):
    queryset = AdmitCard.objects.select_related('student', 'exam').all()
    serializer_class = AdmitCardSerializer
    permission_classes = [IsAuthenticated, IsFacultyOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['exam', 'eligibility_status', 'is_downloaded']
    search_fields = ['student__university_reg_number', 'student__first_name', 'seat_number']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAcademicAdmin])
    def generate_qr(self, request, pk=None):
        admit_card = self.get_object()
        payload = f"ADMIT_CARD|{admit_card.student_id}|{admit_card.exam_id}|{admit_card.admit_card_id}"
        encrypted_payload = encrypt_qr_payload(payload)
        admit_card.qr_code_data = encrypted_payload
        admit_card.save()
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(encrypted_payload)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return Response({
            'qr_code': f"data:image/png;base64,{img_str}",
            'admit_card_id': admit_card.admit_card_id,
            'student_name': f"{admit_card.student.first_name} {admit_card.student.last_name}",
            'exam_name': admit_card.exam.exam_name
        })

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAcademicAdmin])
    def verify_qr(self, request):
        qr_data = request.data.get('qr_data')
        if not qr_data:
            return Response({'error': 'QR data required'}, status=status.HTTP_400_BAD_REQUEST)
        decrypted_payload = decrypt_qr_payload(qr_data)
        if not decrypted_payload:
            return Response({'error': 'Invalid QR code'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            parts = decrypted_payload.split('|')
            if len(parts) >= 4 and parts[0] == 'ADMIT_CARD':
                admit_card_id = int(parts[3])
                admit_card = AdmitCard.objects.get(admit_card_id=admit_card_id)
                eligible, reason = is_eligible_for_exam(admit_card.student, admit_card.exam)
                return Response({
                    'admit_card_id': admit_card_id,
                    'student': {
                        'id': admit_card.student.student_id,
                        'name': f"{admit_card.student.first_name} {admit_card.student.last_name}",
                        'reg_number': admit_card.student.university_reg_number,
                        'program': admit_card.student.program.program_name
                    },
                    'exam': {
                        'id': admit_card.exam.exam_id,
                        'name': admit_card.exam.exam_name,
                        'type': admit_card.exam.exam_type,
                        'date': admit_card.exam.schedules.first().exam_date if admit_card.exam.schedules.exists() else None
                    },
                    'eligible': eligible,
                    'reason': reason
                })
        except (ValueError, AdmitCard.DoesNotExist):
            pass
        return Response({'error': 'Admit card not found'}, status=status.HTTP_404_NOT_FOUND)

class ZoomClassViewSet(viewsets.ModelViewSet):
    queryset = ZoomClass.objects.select_related('offering', 'created_by_faculty').all()
    serializer_class = ZoomClassSerializer
    permission_classes = [IsAuthenticated, CanManageZoomClasses]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['offering', 'platform', 'is_active']
    search_fields = ['topic', 'offering__course__course_code']
    ordering_fields = ['schedule_date', 'start_time']

    def create(self, request, *args, **kwargs):
        serializer = ZoomMeetingSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            platform = request.data.get('platform', 'zoom')
            if platform == 'zoom':
                result = create_zoom_class(data)
            else:
                result = create_google_meet_class(data)
            if result['success']:
                zoom_class = ZoomClass.objects.create(
                    offering_id=data['offering_id'],
                    topic=data['topic'],
                    schedule_date=data['schedule_date'],
                    start_time=data['start_time'],
                    duration_minutes=data.get('duration_minutes', 60),
                    meeting_id=result.get('meeting_id', ''),
                    join_link=result['join_link'],
                    start_url=result.get('start_url', result['join_link']),
                    platform=platform,
                    created_by_faculty=request.user.faculty_profile if hasattr(request.user, 'faculty_profile') else None
                )
                zoom_serializer = ZoomClassSerializer(zoom_class)
                return Response(zoom_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanManageZoomClasses])
    def start_meeting(self, request, pk=None):
        zoom_class = self.get_object()
        return Response({
            'start_url': zoom_class.start_url,
            'join_url': zoom_class.join_link,
            'platform': zoom_class.platform
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanManageZoomClasses])
    def send_reminder(self, request, pk=None):
        zoom_class = self.get_object()
        enrolled_students = Student.objects.filter(
            studentcourseregistration__offering=zoom_class.offering,
            studentcourseregistration__status='registered'
        )
        result = send_class_reminder(enrolled_students, zoom_class)
        return Response(result)

class StudyMaterialViewSet(viewsets.ModelViewSet):
    queryset = StudyMaterial.objects.select_related('offering', 'uploaded_by_faculty').all()
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated, CanViewMaterials]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['offering', 'file_type', 'access_level', 'is_visible']
    search_fields = ['title', 'offering__course__course_code']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), CanUploadMaterials()]
        return [IsAuthenticated(), CanViewMaterials()]

class ResultPublicationViewSet(viewsets.ModelViewSet):
    queryset = ResultPublication.objects.select_related('semester', 'published_by_admin').all()
    serializer_class = ResultPublicationSerializer
    permission_classes = [IsAuthenticated, IsAcademicAdmin]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'semester']
    ordering_fields = ['publish_date', 'semester__start_date']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAcademicAdmin])
    def publish(self, request, pk=None):
        result_pub = self.get_object()
        result_pub.status = 'published'
        result_pub.published_to_students_at = timezone.now()
        result_pub.save()
        enrollments = Enrollment.objects.filter(semester=result_pub.semester, status='confirmed')
        for enrollment in enrollments:
            send_result_notification(enrollment.student, result_pub.semester, enrollment.student.current_gpa)
        return Response({'status': 'Results published successfully'})

class TranscriptViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transcript.objects.select_related('student', 'issued_by_admin').all()
    serializer_class = TranscriptSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['student', 'is_official']
    ordering_fields = ['generated_date']

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.select_related('posted_by_user', 'department').all()
    serializer_class = NoticeSerializer
    permission_classes = [IsAuthenticated, CanViewNotices]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['priority', 'target_audience', 'department', 'is_pinned']
    search_fields = ['title', 'content']
    ordering_fields = ['post_date', 'priority']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), CanManageNotices()]
        return [IsAuthenticated(), CanViewNotices()]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_notices(self, request):
        user = request.user
        if user.role == 'student':
            student = user.student_profile
            notices = Notice.objects.filter(
                Q(target_audience='all') |
                Q(target_audience='students') |
                Q(target_audience='specific_department', department=student.program.department)
            )
        elif user.role == 'faculty':
            faculty = user.faculty_profile
            notices = Notice.objects.filter(
                Q(target_audience='all') |
                Q(target_audience='faculty') |
                Q(target_audience='specific_department', department=faculty.department)
            )
        else:
            notices = Notice.objects.all()
        notices = notices.filter(Q(expiry_date__isnull=True) | Q(expiry_date__gte=timezone.now()))
        serializer = NoticeSerializer(notices, many=True)
        return Response(serializer.data)

class AdmissionInquiryViewSet(viewsets.ModelViewSet):
    queryset = AdmissionInquiry.objects.select_related('assigned_to_admin').all()
    serializer_class = AdmissionInquirySerializer
    permission_classes = [IsAuthenticated, CanViewAdmissions]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'source', 'assigned_to_admin']
    search_fields = ['first_name', 'last_name', 'email', 'program_interest']
    ordering_fields = ['inquiry_date', 'status']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), CanManageAdmissions()]
        return [IsAuthenticated(), CanViewAdmissions()]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanManageAdmissions])
    def assign(self, request, pk=None):
        inquiry = self.get_object()
        admin_id = request.data.get('admin_id')
        if admin_id:
            try:
                admin = AcademicAdmin.objects.get(admin_id=admin_id)
                inquiry.assigned_to_admin = admin
                inquiry.save()
                return Response({'status': 'Inquiry assigned successfully'})
            except AcademicAdmin.DoesNotExist:
                return Response({'error': 'Admin not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Admin ID required'}, status=status.HTTP_400_BAD_REQUEST)

class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.select_related('inquiry', 'program', 'accepted_by_admin').all()
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated, CanViewAdmissions]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'program']
    search_fields = ['application_number', 'inquiry__first_name', 'inquiry__last_name', 'inquiry__email']
    ordering_fields = ['applied_date', 'status']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), CanManageAdmissions()]
        return [IsAuthenticated(), CanViewAdmissions()]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanManageAdmissions])
    def accept(self, request, pk=None):
        applicant = self.get_object()
        applicant.status = 'accepted'
        applicant.accepted_date = timezone.now()
        applicant.accepted_by_admin = request.user.admin_profile
        applicant.save()
        from .utils import generate_university_reg_number
        student = Student.objects.create(
            user=User.objects.create_user(
                email=applicant.inquiry.email,
                first_name=applicant.inquiry.first_name,
                last_name=applicant.inquiry.last_name,
                role='student'
            ),
            first_name=applicant.inquiry.first_name,
            last_name=applicant.inquiry.last_name,
            phone=applicant.inquiry.phone,
            program=applicant.program,
            enrollment_date=timezone.now()
        )
        send_student_admission_confirmation(student)
        return Response({'status': 'Applicant accepted and student record created'})

class GPAViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, CanGenerateReports]

    @action(detail=False, methods=['post'])
    def calculate(self, request):
        serializer = GPAReportSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            student_id = data['student_id']
            semester_id = data.get('semester_id')
            registrations = StudentCourseRegistration.objects.filter(
                student_id=student_id,
                status='completed',
                grade_points__isnull=False
            )
            if semester_id:
                registrations = registrations.filter(offering__semester_id=semester_id)
            if registrations.exists():
                total_points = sum(reg.grade_points * reg.offering.course.credit_hours for reg in registrations)
                total_credits = sum(reg.offering.course.credit_hours for reg in registrations)
                gpa = total_points / total_credits if total_credits > 0 else 0
                return Response({
                    'student_id': student_id,
                    'semester_id': semester_id,
                    'gpa': round(gpa, 2),
                    'total_credits': total_credits,
                    'total_courses': registrations.count()
                })
            return Response({'error': 'No completed courses found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def class_performance(self, request):
        offering_id = request.query_params.get('offering_id')
        if not offering_id:
            return Response({'error': 'Offering ID required'}, status=status.HTTP_400_BAD_REQUEST)
        grades = Grade.objects.filter(offering_id=offering_id, is_finalized=True)
        if not grades.exists():
            return Response({'error': 'No grades found for this offering'}, status=status.HTTP_404_NOT_FOUND)
        stats = grades.aggregate(
            total_students=Count('student', distinct=True),
            average_score=Avg('marks_obtained')
        )
        grade_distribution = {}
        for grade in grades:
            grade_letter = grade.grade
            grade_distribution[grade_letter] = grade_distribution.get(grade_letter, 0) + 1
        return Response({
            'offering_id': offering_id,
            'total_students': stats['total_students'],
            'average_score': round(stats['average_score'], 2) if stats['average_score'] else 0,
            'grade_distribution': grade_distribution
        })