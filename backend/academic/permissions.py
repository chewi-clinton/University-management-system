from rest_framework import permissions
from django.core.exceptions import ObjectDoesNotExist


class BaseRolePermission(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return True


class IsSuperAdmin(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == 'super_admin'


class IsAcademicAdmin(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['academic_admin', 'super_admin']


class IsFaculty(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']


class IsStudent(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role == 'student'


class IsFacultyOrAdmin(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']


class IsStudentOrAdmin(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ['student', 'academic_admin', 'super_admin']


class IsOwnerOrAdmin(BaseRolePermission):
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        if hasattr(obj, 'student') and obj.student.user == request.user:
            return True
        
        if hasattr(obj, 'faculty') and obj.faculty.user == request.user:
            return True
        
        return False


class IsEnrolledStudent(BaseRolePermission):
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        if request.user.role in ['super_admin', 'academic_admin']:
            return True
        
        if request.user.role == 'student':
            try:
                from .models import Student, StudentCourseRegistration
                student = request.user.student_profile
                
                if hasattr(obj, 'course'):
                    return StudentCourseRegistration.objects.filter(
                        student=student,
                        offering=obj,
                        status='registered'
                    ).exists()
                
                if hasattr(obj, 'offering'):
                    return StudentCourseRegistration.objects.filter(
                        student=student,
                        offering=obj.offering,
                        status='registered'
                    ).exists()
                
                if hasattr(obj, 'student') and obj.student == student:
                    return True
                    
            except (ObjectDoesNotExist, AttributeError):
                return False
        
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
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
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
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        if request.user.role == 'student':
            try:
                if hasattr(obj, 'student') and obj.student.user == request.user:
                    return True
            except AttributeError:
                return False
        
        if request.user.role == 'faculty':
            try:
                if hasattr(obj, 'offering') and obj.offering.faculty.user == request.user:
                    return True
            except AttributeError:
                return False
        
        return False


class CanModifyGrades(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
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
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']


class CanViewExamDetails(BaseRolePermission):
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        if request.user.role == 'faculty':
            try:
                if hasattr(obj, 'offering') and obj.offering.faculty.user == request.user:
                    return True
            except AttributeError:
                return False
        
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
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
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
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']


class CanViewMaterials(BaseRolePermission):
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        if request.user.role == 'faculty':
            try:
                if hasattr(obj, 'offering') and obj.offering.faculty.user == request.user:
                    return True
            except AttributeError:
                return False
        
        if request.user.role == 'student':
            try:
                from .models import Student, StudentCourseRegistration
                student = request.user.student_profile
                
                if hasattr(obj, 'offering'):
                    enrolled = StudentCourseRegistration.objects.filter(
                        student=student,
                        offering=obj.offering,
                        status='registered'
                    ).exists()
                    
                    if enrolled and obj.access_level in ['enrolled_students', 'public']:
                        return True
                    
                    if obj.access_level == 'public':
                        return True
                        
            except (ObjectDoesNotExist, AttributeError):
                return False
        
        return False


class CanManageNotices(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['academic_admin', 'super_admin']


class CanViewNotices(BaseRolePermission):
    
    def has_object_permission(self, request, view, obj):
        if not super().has_permission(request, view):
            return False
        
        if request.user.role in ['academic_admin', 'super_admin']:
            return True
        
        if obj.target_audience == 'all':
            return True
        
        if obj.target_audience == 'students' and request.user.role == 'student':
            return True
        
        if obj.target_audience == 'faculty' and request.user.role == 'faculty':
            return True
        
        if obj.target_audience == 'specific_department' and obj.department:
            try:
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
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['academic_admin', 'super_admin']


class CanViewAdmissions(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['academic_admin', 'super_admin']


class CanGenerateReports(BaseRolePermission):
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        return request.user.role in ['faculty', 'academic_admin', 'super_admin']