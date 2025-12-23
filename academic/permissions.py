from rest_framework import permissions
from django.core.exceptions import ObjectDoesNotExist


class BaseRolePermission(permissions.BasePermission):
    """Base permission class for role-based access"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return True


class IsSuperAdmin(BaseRolePermission):
    """Permission for super admin access"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == 'super_admin'


class IsAcademicAdmin(BaseRolePermission):
    """Permission for academic admin access"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['academic_admin', 'super_admin']


class IsFaculty(BaseRolePermission):
    """Permission for faculty access"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']


class IsStudent(BaseRolePermission):
    """Permission for student access"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == 'student'


class IsFacultyOrAdmin(BaseRolePermission):
    """Permission for faculty or admin access"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']


class IsStudentOrAdmin(BaseRolePermission):
    """Permission for student or admin access"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['student', 'academic_admin', 'super_admin']


class IsOwnerOrAdmin(BaseRolePermission):
    """Permission for accessing own records or admin access"""
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        # Check if the object belongs to the user
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        # For student-related objects
        if hasattr(obj, 'student') and obj.student.user == request.user:
            return True
        
        # For faculty-related objects
        if hasattr(obj, 'faculty') and obj.faculty.user == request.user:
            return True
        
        return False


class IsEnrolledStudent(BaseRolePermission):
    """Permission for students enrolled in a specific course"""
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        # Super admins and academic admins have full access
        if request.user.role in ['super_admin', 'academic_admin']:
            return True
        
        # Students can only access if enrolled
        if request.user.role == 'student':
            try:
                from .models import Student, StudentCourseRegistration
                student = request.user.student_profile
                
                # For CourseOffering objects
                if hasattr(obj, 'course'):
                    return StudentCourseRegistration.objects.filter(
                        student=student,
                        offering=obj,
                        status='registered'
                    ).exists()
                
                # For other objects with offering relationship
                if hasattr(obj, 'offering'):
                    return StudentCourseRegistration.objects.filter(
                        student=student,
                        offering=obj.offering,
                        status='registered'
                    ).exists()
                
                # For attendance records
                if hasattr(obj, 'student') and obj.student == student:
                    return True
                    
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        # Faculty can access courses they teach
        if request.user.role == 'faculty':
            try:
                from .models import Faculty
                faculty = request.user.faculty_profile
                
                if hasattr(obj, 'faculty') and obj.faculty == faculty:
                    return True
                
                if hasattr(obj, 'offering') and obj.offering.faculty == faculty:
                    return True
                    
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        return False


class CanMarkAttendance(BaseRolePermission):
    """Permission for marking attendance"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Only faculty and admins can mark attendance
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        # Faculty can only mark attendance for their own courses
        if request.user.role == 'faculty':
            try:
                from .models import Faculty
                faculty = request.user.faculty_profile
                
                if hasattr(obj, 'offering') and obj.offering.faculty == faculty:
                    return True
                    
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        return False


class CanViewGrades(BaseRolePermission):
    """Permission for viewing grades"""
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        # Admins can view all grades
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        # Students can view their own grades
        if request.user.role == 'student':
            try:
                if hasattr(obj, 'student') and obj.student.user == request.user:
                    return True
            except AttributeError:
                return False
        
        # Faculty can view grades for courses they teach
        if request.user.role == 'faculty':
            try:
                if hasattr(obj, 'offering') and obj.offering.faculty.user == request.user:
                    return True
            except AttributeError:
                return False
        
        return False


class CanModifyGrades(BaseRolePermission):
    """Permission for modifying grades"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Only faculty and admins can modify grades
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        # Faculty can only modify grades for courses they teach
        if request.user.role == 'faculty':
            try:
                from .models import Faculty
                faculty = request.user.faculty_profile
                
                if hasattr(obj, 'offering') and obj.offering.faculty == faculty:
                    return True
                    
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        return False


class CanCreateExams(BaseRolePermission):
    """Permission for creating exams"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Only faculty and admins can create exams
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']


class CanViewExamDetails(BaseRolePermission):
    """Permission for viewing exam details"""
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        # Admins can view all exam details
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        # Faculty can view exams for courses they teach
        if request.user.role == 'faculty':
            try:
                if hasattr(obj, 'offering') and obj.offering.faculty.user == request.user:
                    return True
            except AttributeError:
                return False
        
        # Students can view exam details for their registered courses
        if request.user.role == 'student':
            try:
                from .models import Student, StudentCourseRegistration
                student = request.user.student_profile
                
                if hasattr(obj, 'offering'):
                    return StudentCourseRegistration.objects.filter(
                        student=student,
                        offering=obj.offering,
                        status='registered'
                    ).exists()
                    
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        return False


class CanManageZoomClasses(BaseRolePermission):
    """Permission for managing Zoom classes"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Only faculty and admins can manage Zoom classes
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        # Faculty can only manage their own Zoom classes
        if request.user.role == 'faculty':
            try:
                from .models import Faculty
                faculty = request.user.faculty_profile
                
                if hasattr(obj, 'created_by_faculty') and obj.created_by_faculty == faculty:
                    return True
                    
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        return False


class CanUploadMaterials(BaseRolePermission):
    """Permission for uploading study materials"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Only faculty and admins can upload materials
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']


class CanViewMaterials(BaseRolePermission):
    """Permission for viewing study materials"""
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        # Admins can view all materials
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        # Faculty can view materials for courses they teach
        if request.user.role == 'faculty':
            try:
                if hasattr(obj, 'offering') and obj.offering.faculty.user == request.user:
                    return True
            except AttributeError:
                return False
        
        # Students can view materials for enrolled courses
        if request.user.role == 'student':
            try:
                from .models import Student, StudentCourseRegistration
                student = request.user.student_profile
                
                if hasattr(obj, 'offering'):
                    # Check if student is enrolled
                    enrolled = StudentCourseRegistration.objects.filter(
                        student=student,
                        offering=obj.offering,
                        status='registered'
                    ).exists()
                    
                    # Check access level
                    if enrolled and obj.access_level in ['enrolled_students', 'public']:
                        return True
                    
                    if obj.access_level == 'public':
                        return True
                        
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        return False


class CanManageNotices(BaseRolePermission):
    """Permission for managing notices"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Only admins can manage notices
        return request.user.role in ['academic_admin', 'super_admin']


class CanViewNotices(BaseRolePermission):
    """Permission for viewing notices"""
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        # Admins can view all notices
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        # Check target audience
        if obj.target_audience == 'all':
            return True
        
        if obj.target_audience == 'students' and request.user.role == 'student':
            return True
        
        if obj.target_audience == 'faculty' and request.user.role == 'faculty':
            return True
        
        if obj.target_audience == 'specific_department' and obj.department:
            try:
                # Check if user belongs to the department
                if request.user.role == 'student':
                    student = request.user.student_profile
                    return student.program.department == obj.department
                
                if request.user.role == 'faculty':
                    faculty = request.user.faculty_profile
                    return faculty.department == obj.department
                    
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        return False


class CanManageAdmissions(BaseRolePermission):
    """Permission for managing admissions"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Only admins can manage admissions
        return request.user.role in ['academic_admin', 'super_admin']


class CanViewAdmissions(BaseRolePermission):
    """Permission for viewing admission data"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Only admins can view admission data
        return request.user.role in ['academic_admin', 'super_admin']


class CanGenerateReports(BaseRolePermission):
    """Permission for generating reports"""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Faculty and admins can generate reports
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']