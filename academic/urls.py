from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, FacultyMemberViewSet, DepartmentViewSet, ProgramViewSet,
    CourseViewSet, CoursePrerequisiteViewSet, AcademicSessionViewSet,
    SemesterViewSet, StudentViewSet, AcademicAdminViewSet,
    EnrollmentViewSet, CourseOfferingViewSet, StudentCourseRegistrationViewSet,
    AttendanceViewSet, AttendanceSummaryViewSet, GradeViewSet,
    ExaminationViewSet, ExamRoomViewSet, ExamScheduleViewSet,
    AdmitCardViewSet, ZoomClassViewSet, StudyMaterialViewSet,
    ResultPublicationViewSet, TranscriptViewSet, NoticeViewSet,
    AdmissionInquiryViewSet, ApplicantViewSet, GPAViewSet
)

router = DefaultRouter()

# User management
router.register(r'users', UserViewSet, basename='user')

# Academic structure
# Note: Faculties refer to academic units (e.g., Faculty of Engineering)
# Faculty members (teachers/professors) are registered under 'faculty-members'
router.register(r'faculties', FacultyMemberViewSet, basename='faculty')  # Keep URL as 'faculty' for backward compatibility if needed, or change to 'faculty-members'
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'programs', ProgramViewSet, basename='program')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'course-prerequisites', CoursePrerequisiteViewSet, basename='courseprerequisite')

# Academic calendar
router.register(r'sessions', AcademicSessionViewSet, basename='academicsession')
router.register(r'semesters', SemesterViewSet, basename='semester')

# User profiles
router.register(r'students', StudentViewSet, basename='student')
router.register(r'faculty-members', FacultyMemberViewSet, basename='facultymember')  # Recommended URL
router.register(r'admins', AcademicAdminViewSet, basename='academicadmin')

# Enrollment and registration
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'course-offerings', CourseOfferingViewSet, basename='courseoffering')
router.register(r'course-registrations', StudentCourseRegistrationViewSet, basename='studentcourseregistration')

# Attendance
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'attendance-summaries', AttendanceSummaryViewSet, basename='attendancesummary')

# Grades and assessments
router.register(r'grades', GradeViewSet, basename='grade')
router.register(r'examinations', ExaminationViewSet, basename='examination')
router.register(r'exam-rooms', ExamRoomViewSet, basename='examroom')
router.register(r'exam-schedules', ExamScheduleViewSet, basename='examschedule')
router.register(r'admit-cards', AdmitCardViewSet, basename='admitcard')

# Virtual classes
router.register(r'zoom-classes', ZoomClassViewSet, basename='zoomclass')
router.register(r'study-materials', StudyMaterialViewSet, basename='studymaterial')

# Results and transcripts
router.register(r'result-publications', ResultPublicationViewSet, basename='resultpublication')
router.register(r'transcripts', TranscriptViewSet, basename='transcript')

# Communications
router.register(r'notices', NoticeViewSet, basename='notice')

# Admissions
router.register(r'admission-inquiries', AdmissionInquiryViewSet, basename='admissioninquiry')
router.register(r'applicants', ApplicantViewSet, basename='applicant')

# Custom API endpoints
urlpatterns = [
    path('', include(router.urls)),
    
    # GPA calculation endpoint
    path('gpa/calculate/', GPAViewSet.as_view({'post': 'calculate'}), name='gpa-calculate'),
    path('gpa/class-performance/', GPAViewSet.as_view({'get': 'class_performance'}), name='gpa-class-performance'),
    
    # QR code attendance endpoints
    path('attendance/mark-by-qr/', AttendanceViewSet.as_view({'post': 'mark_by_qr'}), name='attendance-mark-by-qr'),
    path('attendance/generate-qr/', AttendanceViewSet.as_view({'post': 'generate_qr'}), name='attendance-generate-qr'),
    
    # Admit card QR verification
    path('admit-cards/verify-qr/', AdmitCardViewSet.as_view({'post': 'verify_qr'}), name='admitcard-verify-qr'),
    
    # Zoom/Meet class creation
    path('zoom-classes/create-meeting/', ZoomClassViewSet.as_view({'post': 'create'}), name='zoomclass-create-meeting'),
    
    # Notice endpoints
    path('notices/my-notices/', NoticeViewSet.as_view({'get': 'my_notices'}), name='notice-my-notices'),
    
    # Admission inquiry assignment
    path('admission-inquiries/<int:pk>/assign/', AdmissionInquiryViewSet.as_view({'post': 'assign'}), name='admissioninquiry-assign'),
    
    # Applicant acceptance
    path('applicants/<int:pk>/accept/', ApplicantViewSet.as_view({'post': 'accept'}), name='applicant-accept'),
    
    # Academic session activation
    path('sessions/<int:pk>/activate/', AcademicSessionViewSet.as_view({'post': 'activate'}), name='session-activate'),
    
    # Enrollment confirmation
    path('enrollments/<int:pk>/confirm/', EnrollmentViewSet.as_view({'post': 'confirm'}), name='enrollment-confirm'),
    
    # Grade finalization
    path('grades/<int:pk>/finalize/', GradeViewSet.as_view({'post': 'finalize'}), name='grade-finalize'),
    
    # Course registration withdrawal
    path('course-registrations/<int:pk>/withdraw/', StudentCourseRegistrationViewSet.as_view({'post': 'withdraw'}), name='courseregistration-withdraw'),
    
    # Zoom class actions
    path('zoom-classes/<int:pk>/start-meeting/', ZoomClassViewSet.as_view({'post': 'start_meeting'}), name='zoomclass-start-meeting'),
    path('zoom-classes/<int:pk>/send-reminder/', ZoomClassViewSet.as_view({'post': 'send_reminder'}), name='zoomclass-send-reminder'),
    
    # Result publication
    path('result-publications/<int:pk>/publish/', ResultPublicationViewSet.as_view({'post': 'publish'}), name='resultpublication-publish'),
    
    # Admit card QR generation
    path('admit-cards/<int:pk>/generate-qr/', AdmitCardViewSet.as_view({'post': 'generate_qr'}), name='admitcard-generate-qr'),
]