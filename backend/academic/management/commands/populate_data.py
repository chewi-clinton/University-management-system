"""
Django management command to populate the database with sample data.
Save this file as: academic/management/commands/populate_data.py
Run with: python manage.py populate_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from academic.models import (
    User, Faculty, Department, Program, Course, CoursePrerequisite,
    AcademicSession, Semester, Student, FacultyMember, AcademicAdmin,
    CourseOffering, Enrollment, StudentCourseRegistration, ExamRoom,
    Examination, ExamSchedule, Notice
)
import random


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database population...')

        # Create superuser
        self.create_superuser()
        
        # Create faculties
        faculties = self.create_faculties()
        
        # Create departments
        departments = self.create_departments(faculties)
        
        # Create programs
        programs = self.create_programs(departments)
        
        # Create courses
        courses = self.create_courses(departments)
        
        # Create academic sessions and semesters
        sessions, semesters = self.create_sessions_and_semesters()
        
        # Create faculty members
        faculty_members = self.create_faculty_members(departments)
        
        # Create students
        students = self.create_students(programs)
        
        # Create academic admins
        admins = self.create_academic_admins(departments)
        
        # Create course offerings
        offerings = self.create_course_offerings(courses, semesters, faculty_members)
        
        # Create enrollments
        enrollments = self.create_enrollments(students, semesters, admins)
        
        # Create exam rooms
        exam_rooms = self.create_exam_rooms()
        
        # Create notices
        self.create_notices(departments)

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))

    def create_superuser(self):
        if not User.objects.filter(email='admin@university.edu').exists():
            User.objects.create_superuser(
                email='admin@university.edu',
                password='admin123',
                first_name='Super',
                last_name='Admin'
            )
            self.stdout.write(self.style.SUCCESS('✓ Superuser created'))

    def create_faculties(self):
        faculty_data = [
            {'name': 'Faculty of Engineering', 'code': 'ENG', 'description': 'Engineering and Technology programs'},
            {'name': 'Faculty of Science', 'code': 'SCI', 'description': 'Natural and Applied Sciences'},
            {'name': 'Faculty of Arts', 'code': 'ART', 'description': 'Humanities and Social Sciences'},
            {'name': 'Faculty of Business', 'code': 'BUS', 'description': 'Business and Management'},
            {'name': 'Faculty of Medicine', 'code': 'MED', 'description': 'Medical and Health Sciences'},
        ]
        
        faculties = []
        for data in faculty_data:
            faculty, created = Faculty.objects.get_or_create(
                faculty_code=data['code'],
                defaults={
                    'faculty_name': data['name'],
                    'description': data['description']
                }
            )
            faculties.append(faculty)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(faculties)} faculties'))
        return faculties

    def create_departments(self, faculties):
        dept_data = [
            # Engineering
            {'name': 'Computer Science', 'code': 'CS', 'faculty': 0, 'location': 'Building A, Floor 3'},
            {'name': 'Electrical Engineering', 'code': 'EE', 'faculty': 0, 'location': 'Building A, Floor 2'},
            {'name': 'Mechanical Engineering', 'code': 'ME', 'faculty': 0, 'location': 'Building B, Floor 1'},
            # Science
            {'name': 'Mathematics', 'code': 'MATH', 'faculty': 1, 'location': 'Building C, Floor 2'},
            {'name': 'Physics', 'code': 'PHYS', 'faculty': 1, 'location': 'Building C, Floor 3'},
            {'name': 'Chemistry', 'code': 'CHEM', 'faculty': 1, 'location': 'Building C, Floor 1'},
            # Arts
            {'name': 'English Literature', 'code': 'ENG', 'faculty': 2, 'location': 'Building D, Floor 1'},
            {'name': 'History', 'code': 'HIST', 'faculty': 2, 'location': 'Building D, Floor 2'},
            # Business
            {'name': 'Business Administration', 'code': 'BA', 'faculty': 3, 'location': 'Building E, Floor 1'},
            {'name': 'Economics', 'code': 'ECON', 'faculty': 3, 'location': 'Building E, Floor 2'},
        ]
        
        departments = []
        for data in dept_data:
            dept, created = Department.objects.get_or_create(
                department_code=data['code'],
                defaults={
                    'department_name': data['name'],
                    'faculty': faculties[data['faculty']],
                    'office_location': data['location']
                }
            )
            departments.append(dept)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(departments)} departments'))
        return departments

    def create_programs(self, departments):
        program_data = [
            # Computer Science
            {'name': 'BSc Computer Science', 'code': 'BSCS', 'dept': 0, 'type': 'undergraduate', 'years': 4, 'credits': 120},
            {'name': 'MSc Computer Science', 'code': 'MSCS', 'dept': 0, 'type': 'graduate', 'years': 2, 'credits': 60},
            # Electrical Engineering
            {'name': 'BSc Electrical Engineering', 'code': 'BSEE', 'dept': 1, 'type': 'undergraduate', 'years': 4, 'credits': 128},
            # Mechanical Engineering
            {'name': 'BSc Mechanical Engineering', 'code': 'BSME', 'dept': 2, 'type': 'undergraduate', 'years': 4, 'credits': 128},
            # Mathematics
            {'name': 'BSc Mathematics', 'code': 'BSMATH', 'dept': 3, 'type': 'undergraduate', 'years': 4, 'credits': 120},
            # Business
            {'name': 'BBA', 'code': 'BBA', 'dept': 8, 'type': 'undergraduate', 'years': 4, 'credits': 120},
            {'name': 'MBA', 'code': 'MBA', 'dept': 8, 'type': 'graduate', 'years': 2, 'credits': 60},
        ]
        
        programs = []
        for data in program_data:
            program, created = Program.objects.get_or_create(
                program_code=data['code'],
                defaults={
                    'program_name': data['name'],
                    'department': departments[data['dept']],
                    'program_type': data['type'],
                    'duration_years': data['years'],
                    'total_credits_required': data['credits'],
                    'description': f'{data["name"]} program'
                }
            )
            programs.append(program)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(programs)} programs'))
        return programs

    def create_courses(self, departments):
        course_data = [
            # CS Courses
            {'code': 'CS101', 'name': 'Introduction to Programming', 'dept': 0, 'credits': 3, 'elective': False},
            {'code': 'CS102', 'name': 'Data Structures', 'dept': 0, 'credits': 3, 'elective': False},
            {'code': 'CS201', 'name': 'Algorithms', 'dept': 0, 'credits': 3, 'elective': False},
            {'code': 'CS301', 'name': 'Database Systems', 'dept': 0, 'credits': 3, 'elective': False},
            {'code': 'CS302', 'name': 'Operating Systems', 'dept': 0, 'credits': 3, 'elective': False},
            {'code': 'CS401', 'name': 'Machine Learning', 'dept': 0, 'credits': 3, 'elective': True},
            {'code': 'CS402', 'name': 'Computer Networks', 'dept': 0, 'credits': 3, 'elective': False},
            # Math Courses
            {'code': 'MATH101', 'name': 'Calculus I', 'dept': 3, 'credits': 4, 'elective': False},
            {'code': 'MATH102', 'name': 'Calculus II', 'dept': 3, 'credits': 4, 'elective': False},
            {'code': 'MATH201', 'name': 'Linear Algebra', 'dept': 3, 'credits': 3, 'elective': False},
            {'code': 'MATH301', 'name': 'Probability & Statistics', 'dept': 3, 'credits': 3, 'elective': False},
            # EE Courses
            {'code': 'EE101', 'name': 'Circuit Analysis', 'dept': 1, 'credits': 3, 'elective': False},
            {'code': 'EE201', 'name': 'Electronics', 'dept': 1, 'credits': 3, 'elective': False},
            # Business
            {'code': 'BUS101', 'name': 'Principles of Management', 'dept': 8, 'credits': 3, 'elective': False},
            {'code': 'BUS201', 'name': 'Marketing', 'dept': 8, 'credits': 3, 'elective': False},
        ]
        
        courses = []
        for data in course_data:
            course, created = Course.objects.get_or_create(
                course_code=data['code'],
                defaults={
                    'course_name': data['name'],
                    'department': departments[data['dept']],
                    'credit_hours': data['credits'],
                    'is_elective': data['elective'],
                    'description': f'Course description for {data["name"]}'
                }
            )
            courses.append(course)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(courses)} courses'))
        return courses

    def create_sessions_and_semesters(self):
        sessions = []
        semesters = []
        
        # Create 2025-2026 session
        session, created = AcademicSession.objects.get_or_create(
            session_name='2025-2026',
            defaults={
                'academic_year': 2025,
                'start_date': '2025-09-01',
                'end_date': '2026-06-30',
                'is_active': True
            }
        )
        sessions.append(session)
        
        # Fall 2025
        sem1, created = Semester.objects.get_or_create(
            session=session,
            semester_number=1,
            defaults={
                'semester_name': 'Fall',
                'start_date': '2025-09-01',
                'end_date': '2025-12-20',
                'enrollment_start_date': '2025-08-15',
                'enrollment_end_date': '2025-09-10',
                'status': 'completed'
            }
        )
        semesters.append(sem1)
        
        # Spring 2026
        sem2, created = Semester.objects.get_or_create(
            session=session,
            semester_number=2,
            defaults={
                'semester_name': 'Spring',
                'start_date': '2026-01-15',
                'end_date': '2026-05-15',
                'enrollment_start_date': '2026-01-01',
                'enrollment_end_date': '2026-01-20',
                'status': 'active'
            }
        )
        semesters.append(sem2)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(sessions)} sessions and {len(semesters)} semesters'))
        return sessions, semesters

    def create_faculty_members(self, departments):
        faculty_data = [
            {'name': 'John', 'last': 'Smith', 'emp_id': 'FAC001', 'dept': 0, 'designation': 'Professor'},
            {'name': 'Sarah', 'last': 'Johnson', 'emp_id': 'FAC002', 'dept': 0, 'designation': 'Associate Professor'},
            {'name': 'Michael', 'last': 'Brown', 'emp_id': 'FAC003', 'dept': 0, 'designation': 'Assistant Professor'},
            {'name': 'Emily', 'last': 'Davis', 'emp_id': 'FAC004', 'dept': 1, 'designation': 'Professor'},
            {'name': 'David', 'last': 'Wilson', 'emp_id': 'FAC005', 'dept': 3, 'designation': 'Professor'},
            {'name': 'Lisa', 'last': 'Anderson', 'emp_id': 'FAC006', 'dept': 8, 'designation': 'Associate Professor'},
        ]
        
        faculty_members = []
        for i, data in enumerate(faculty_data):
            user, created = User.objects.get_or_create(
                email=f'{data["name"].lower()}.{data["last"].lower()}@university.edu',
                defaults={
                    'first_name': data['name'],
                    'last_name': data['last'],
                    'role': 'faculty',
                    'is_active': True
                }
            )
            if created:
                user.set_password('faculty123')
                user.save()
            
            faculty, created = FacultyMember.objects.get_or_create(
                employee_id=data['emp_id'],
                defaults={
                    'user': user,
                    'department': departments[data['dept']],
                    'designation': data['designation'],
                    'phone': f'+237-6{70000000 + i}',
                    'office_number': f'Room {100 + i}',
                    'hire_date': '2020-09-01',
                    'qualification': 'PhD in ' + departments[data['dept']].department_name
                }
            )
            faculty_members.append(faculty)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(faculty_members)} faculty members'))
        return faculty_members

    def create_students(self, programs):
        student_data = [
            {'name': 'Alice', 'last': 'Cooper', 'reg': 'STU2023001', 'program': 0},
            {'name': 'Bob', 'last': 'Dylan', 'reg': 'STU2023002', 'program': 0},
            {'name': 'Charlie', 'last': 'Parker', 'reg': 'STU2023003', 'program': 0},
            {'name': 'Diana', 'last': 'Ross', 'reg': 'STU2023004', 'program': 2},
            {'name': 'Eve', 'last': 'Taylor', 'reg': 'STU2023005', 'program': 5},
            {'name': 'Frank', 'last': 'Sinatra', 'reg': 'STU2023006', 'program': 0},
            {'name': 'Grace', 'last': 'Kelly', 'reg': 'STU2023007', 'program': 1},
            {'name': 'Henry', 'last': 'Ford', 'reg': 'STU2023008', 'program': 3},
        ]
        
        students = []
        for i, data in enumerate(student_data):
            user, created = User.objects.get_or_create(
                email=f'{data["name"].lower()}.{data["last"].lower()}@student.university.edu',
                defaults={
                    'first_name': data['name'],
                    'last_name': data['last'],
                    'role': 'student',
                    'is_active': True
                }
            )
            if created:
                user.set_password('student123')
                user.save()
            
            student, created = Student.objects.get_or_create(
                university_reg_number=data['reg'],
                defaults={
                    'user': user,
                    'first_name': data['name'],
                    'last_name': data['last'],
                    'program': programs[data['program']],
                    'enrollment_date': '2023-09-01',
                    'current_status': 'active',
                    'phone': f'+237-6{80000000 + i}',
                    'date_of_birth': f'200{i % 5}-0{(i % 9) + 1}-15'
                }
            )
            students.append(student)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(students)} students'))
        return students

    def create_academic_admins(self, departments):
        admin_data = [
            {'name': 'Admin', 'last': 'One', 'dept': 0},
            {'name': 'Admin', 'last': 'Two', 'dept': None},
        ]
        
        admins = []
        for i, data in enumerate(admin_data):
            user, created = User.objects.get_or_create(
                email=f'admin{i+1}@university.edu',
                defaults={
                    'first_name': data['name'],
                    'last_name': data['last'],
                    'role': 'academic_admin',
                    'is_active': True,
                    'is_staff': True
                }
            )
            if created:
                user.set_password('admin123')
                user.save()
            
            admin, created = AcademicAdmin.objects.get_or_create(
                user=user,
                defaults={
                    'department': departments[data['dept']] if data['dept'] is not None else None,
                    'permissions': {'can_publish_results': True, 'can_manage_enrollments': True}
                }
            )
            admins.append(admin)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(admins)} academic admins'))
        return admins

    def create_course_offerings(self, courses, semesters, faculty_members):
        offerings = []
        
        # Offer first 5 CS courses in Spring 2026
        for i, course in enumerate(courses[:5]):
            offering, created = CourseOffering.objects.get_or_create(
                course=course,
                semester=semesters[1],  # Spring 2026
                section='A',
                defaults={
                    'faculty': faculty_members[i % len(faculty_members)],
                    'schedule': {
                        'days': ['Monday', 'Wednesday'],
                        'time': f'{9 + i}:00-{10 + i}:30',
                        'room': f'CS-{101 + i}'
                    },
                    'max_students': 40,
                    'current_enrollment': 0,
                    'is_visible': True
                }
            )
            offerings.append(offering)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(offerings)} course offerings'))
        return offerings

    def create_enrollments(self, students, semesters, admins):
        enrollments = []
        
        # Enroll first 6 students in Spring 2026
        for i, student in enumerate(students[:6]):
            enrollment, created = Enrollment.objects.get_or_create(
                student=student,
                semester=semesters[1],  # Spring 2026
                defaults={
                    'enrollment_number': f'ENR2026S{1000 + i}',
                    'enrollment_date': '2026-01-10',
                    'status': 'confirmed',
                    'confirmed_by_admin': admins[0],
                    'confirmed_at': timezone.now()
                }
            )
            enrollments.append(enrollment)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(enrollments)} enrollments'))
        return enrollments

    def create_exam_rooms(self):
        room_data = [
            {'building': 'Main Building', 'room': '101', 'capacity': 50},
            {'building': 'Main Building', 'room': '102', 'capacity': 60},
            {'building': 'Science Block', 'room': '201', 'capacity': 40},
            {'building': 'Engineering Block', 'room': '301', 'capacity': 45},
        ]
        
        rooms = []
        for data in room_data:
            room, created = ExamRoom.objects.get_or_create(
                building=data['building'],
                room_number=data['room'],
                defaults={
                    'capacity': data['capacity'],
                    'facilities': {'has_projector': True, 'has_AC': True}
                }
            )
            rooms.append(room)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(rooms)} exam rooms'))
        return rooms

    def create_notices(self, departments):
        notice_data = [
            {
                'title': 'Spring 2026 Semester Registration Open',
                'content': 'Registration for Spring 2026 semester is now open. Please complete your course registration by January 20, 2026.',
                'priority': 'important',
                'audience': 'students'
            },
            {
                'title': 'Faculty Meeting - January 15',
                'content': 'All faculty members are requested to attend the department meeting on January 15, 2026 at 10:00 AM.',
                'priority': 'normal',
                'audience': 'faculty'
            },
            {
                'title': 'Library Hours Extended',
                'content': 'The university library will now be open until 10:00 PM during exam period.',
                'priority': 'normal',
                'audience': 'all'
            },
        ]
        
        # Create a user for posting notices
        notice_user, created = User.objects.get_or_create(
            email='notices@university.edu',
            defaults={
                'first_name': 'Notice',
                'last_name': 'Admin',
                'role': 'academic_admin',
                'is_active': True
            }
        )
        if created:
            notice_user.set_password('notice123')
            notice_user.save()
        
        for data in notice_data:
            Notice.objects.get_or_create(
                title=data['title'],
                defaults={
                    'content': data['content'],
                    'posted_by_user': notice_user,
                    'priority': data['priority'],
                    'target_audience': data['audience'],
                    'expiry_date': timezone.now().date() + timedelta(days=30)
                }
            )
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(notice_data)} notices'))