from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .auth_views import login_view, current_user_view, logout_view
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

router.register(r'users', UserViewSet, basename='user')
router.register(r'faculties', FacultyMemberViewSet, basename='faculty')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'programs', ProgramViewSet, basename='program')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'course-prerequisites', CoursePrerequisiteViewSet, basename='courseprerequisite')
router.register(r'sessions', AcademicSessionViewSet, basename='academicsession')
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'faculty-members', FacultyMemberViewSet, basename='facultymember')
router.register(r'admins', AcademicAdminViewSet, basename='academicadmin')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'course-offerings', CourseOfferingViewSet, basename='courseoffering')
router.register(r'course-registrations', StudentCourseRegistrationViewSet, basename='studentcourseregistration')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'attendance-summaries', AttendanceSummaryViewSet, basename='attendancesummary')
router.register(r'grades', GradeViewSet, basename='grade')
router.register(r'examinations', ExaminationViewSet, basename='examination')
router.register(r'exam-rooms', ExamRoomViewSet, basename='examroom')
router.register(r'exam-schedules', ExamScheduleViewSet, basename='examschedule')
router.register(r'admit-cards', AdmitCardViewSet, basename='admitcard')
router.register(r'zoom-classes', ZoomClassViewSet, basename='zoomclass')
router.register(r'study-materials', StudyMaterialViewSet, basename='studymaterial')
router.register(r'result-publications', ResultPublicationViewSet, basename='resultpublication')
router.register(r'transcripts', TranscriptViewSet, basename='transcript')
router.register(r'notices', NoticeViewSet, basename='notice')
router.register(r'admission-inquiries', AdmissionInquiryViewSet, basename='admissioninquiry')
router.register(r'applicants', ApplicantViewSet, basename='applicant')

urlpatterns = [
    # Auth endpoints
    path('auth/login/', login_view, name='login'),
    path('auth/me/', current_user_view, name='current-user'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # GPA endpoints
    path('gpa/calculate/', GPAViewSet.as_view({'post': 'calculate'}), name='gpa-calculate'),
    path('gpa/class-performance/', GPAViewSet.as_view({'get': 'class_performance'}), name='gpa-class-performance'),
    
    # Attendance endpoints
    path('attendance/my-attendance/', AttendanceViewSet.as_view({'get': 'my_attendance'}), name='attendance-my-attendance'),
    path('attendance/mark-by-qr/', AttendanceViewSet.as_view({'post': 'mark_by_qr'}), name='attendance-mark-by-qr'),
    path('attendance/generate-qr/', AttendanceViewSet.as_view({'post': 'generate_qr'}), name='attendance-generate-qr'),
    
    # Admit card endpoints
    path('admit-cards/verify-qr/', AdmitCardViewSet.as_view({'post': 'verify_qr'}), name='admitcard-verify-qr'),
    path('admit-cards/<int:pk>/generate-qr/', AdmitCardViewSet.as_view({'post': 'generate_qr'}), name='admitcard-generate-qr'),
    
    # Zoom class endpoints
    path('zoom-classes/create-meeting/', ZoomClassViewSet.as_view({'post': 'create'}), name='zoomclass-create-meeting'),
    path('zoom-classes/<int:pk>/start-meeting/', ZoomClassViewSet.as_view({'post': 'start_meeting'}), name='zoomclass-start-meeting'),
    path('zoom-classes/<int:pk>/send-reminder/', ZoomClassViewSet.as_view({'post': 'send_reminder'}), name='zoomclass-send-reminder'),
    
    # Notice endpoints
    path('notices/my-notices/', NoticeViewSet.as_view({'get': 'my_notices'}), name='notice-my-notices'),
    
    # Admission endpoints
    path('admission-inquiries/<int:pk>/assign/', AdmissionInquiryViewSet.as_view({'post': 'assign'}), name='admissioninquiry-assign'),
    path('applicants/<int:pk>/accept/', ApplicantViewSet.as_view({'post': 'accept'}), name='applicant-accept'),
    
    # Session endpoints
    path('sessions/<int:pk>/activate/', AcademicSessionViewSet.as_view({'post': 'activate'}), name='session-activate'),
    
    # Enrollment endpoints
    path('enrollments/<int:pk>/confirm/', EnrollmentViewSet.as_view({'post': 'confirm'}), name='enrollment-confirm'),
    
    # Grade endpoints
    path('grades/<int:pk>/finalize/', GradeViewSet.as_view({'post': 'finalize'}), name='grade-finalize'),
    
    # Course registration endpoints
    path('course-registrations/my-courses/', StudentCourseRegistrationViewSet.as_view({'get': 'my_courses'}), name='courseregistration-my-courses'),
    path('course-registrations/<int:pk>/withdraw/', StudentCourseRegistrationViewSet.as_view({'post': 'withdraw'}), name='courseregistration-withdraw'),
    
    # Result publication endpoints
    path('result-publications/<int:pk>/publish/', ResultPublicationViewSet.as_view({'post': 'publish'}), name='resultpublication-publish'),

    # PERSONAL STUDENT ENDPOINTS — DEDICATED PREFIX
    path('my/dashboard/', StudentViewSet.as_view({'get': 'dashboard'}), name='student-dashboard'),
    path('my/profile/', StudentViewSet.as_view({'get': 'me'}), name='student-me'),
    path('my/transcript/<int:pk>/', StudentViewSet.as_view({'get': 'transcript'}), name='student-transcript'),
    path('my/attendance_summary/<int:pk>/', StudentViewSet.as_view({'get': 'attendance_summary'}), name='student-attendance-summary'),

    # Router URLs
    path('', include(router.urls)),
]