// Students with detailed info
export const mockStudents = [
  {
    id: 1,
    universityRegNumber: 'UNI-2024-0001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.j@university.edu',
    phone: '+1234567001',
    program: 'Computer Science',
    department: 'Computer Science',
    currentSemester: 5,
    currentGPA: 3.84,
    status: 'active',
    enrollmentDate: '2024-09-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    address: '123 Campus St, City',
    dateOfBirth: '2003-05-15',
    guardianName: 'Robert Johnson',
    guardianPhone: '+1234567999'
  },
  {
    id: 2,
    universityRegNumber: 'UNI-2024-0002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.s@university.edu',
    phone: '+1234567002',
    program: 'Mathematics',
    department: 'Mathematics',
    currentSemester: 3,
    currentGPA: 3.56,
    status: 'active',
    enrollmentDate: '2024-09-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    address: '456 Student Ave, City',
    dateOfBirth: '2004-08-22',
    guardianName: 'Mary Smith',
    guardianPhone: '+1234567888'
  },
  {
    id: 3,
    universityRegNumber: 'UNI-2024-0003',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.b@university.edu',
    phone: '+1234567003',
    program: 'Engineering',
    department: 'Engineering',
    currentSemester: 4,
    currentGPA: 3.72,
    status: 'active',
    enrollmentDate: '2024-09-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    address: '789 Engineering Blvd, City',
    dateOfBirth: '2003-11-10',
    guardianName: 'Charles Brown Sr.',
    guardianPhone: '+1234567777'
  },
  {
    id: 4,
    universityRegNumber: 'UNI-2024-0004',
    firstName: 'Diana',
    lastName: 'Prince',
    email: 'diana.p@university.edu',
    phone: '+1234567004',
    program: 'Business',
    department: 'Business',
    currentSemester: 6,
    currentGPA: 3.91,
    status: 'active',
    enrollmentDate: '2024-09-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    address: '321 Business Way, City',
    dateOfBirth: '2002-12-05',
    guardianName: 'Queen Hippolyta',
    guardianPhone: '+1234567666'
  },
  {
    id: 5,
    universityRegNumber: 'UNI-2024-0005',
    firstName: 'Ethan',
    lastName: 'Hunt',
    email: 'ethan.h@university.edu',
    phone: '+1234567005',
    program: 'Computer Science',
    department: 'Computer Science',
    currentSemester: 2,
    currentGPA: 3.45,
    status: 'active',
    enrollmentDate: '2024-09-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    address: '654 Tech Park, City',
    dateOfBirth: '2004-03-18',
    guardianName: 'Mr. Hunt',
    guardianPhone: '+1234567555'
  }
];

// Faculty with detailed info
export const mockFaculty = [
  {
    id: 1,
    employeeId: 'FAC-2020-001',
    firstName: 'Dr. Jane',
    lastName: 'Smith',
    email: 'jane.smith@university.edu',
    phone: '+1234567100',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Artificial Intelligence',
    hireDate: '2020-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    officeLocation: 'CS Building, Room 301',
    totalCourses: 3,
    totalStudents: 120,
    averageRating: 4.7,
    isActive: true
  },
  {
    id: 2,
    employeeId: 'FAC-2019-015',
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    email: 'michael.chen@university.edu',
    phone: '+1234567101',
    department: 'Mathematics',
    designation: 'Associate Professor',
    specialization: 'Applied Mathematics',
    hireDate: '2019-08-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    officeLocation: 'Math Building, Room 205',
    totalCourses: 2,
    totalStudents: 85,
    averageRating: 4.5,
    isActive: true
  },
  {
    id: 3,
    employeeId: 'FAC-2021-008',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1234567102',
    department: 'Engineering',
    designation: 'Assistant Professor',
    specialization: 'Mechanical Engineering',
    hireDate: '2021-06-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ',
    officeLocation: 'Engineering Block, Room 102',
    totalCourses: 2,
    totalStudents: 75,
    averageRating: 4.3,
    isActive: true
  },
  {
    id: 4,
    employeeId: 'FAC-2018-022',
    firstName: 'Prof. Robert',
    lastName: 'Williams',
    email: 'robert.williams@university.edu',
    phone: '+1234567103',
    department: 'Business',
    designation: 'Professor',
    specialization: 'Marketing Management',
    hireDate: '2018-09-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    officeLocation: 'Business Building, Room 401',
    totalCourses: 3,
    totalStudents: 95,
    averageRating: 4.6,
    isActive: true
  },
  {
    id: 5,
    employeeId: 'FAC-2022-003',
    firstName: 'Dr. Lisa',
    lastName: 'Davis',
    email: 'lisa.davis@university.edu',
    phone: '+1234567104',
    department: 'Physics',
    designation: 'Lecturer',
    specialization: 'Quantum Physics',
    hireDate: '2022-02-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    officeLocation: 'Science Building, Room 201',
    totalCourses: 1,
    totalStudents: 45,
    averageRating: 4.4,
    isActive: true
  }
];

// Generate more students for comprehensive data
export const generateMoreStudents = (count = 50) => {
  const firstNames = ['Emma', 'Oliver', 'Ava', 'Noah', 'Sophia', 'Liam', 'Isabella', 'Mason', 'Mia', 'William', 'Charlotte', 'James', 'Amelia', 'Benjamin', 'Harper', 'Lucas', 'Evelyn', 'Henry', 'Abigail', 'Alexander'];
  const lastNames = ['Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen'];
  const programs = ['Computer Science', 'Mathematics', 'Engineering', 'Business', 'Physics', 'Chemistry'];
  
  const additionalStudents = [];
  
  for (let i = 6; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const program = programs[Math.floor(Math.random() * programs.length)];
    const semester = Math.floor(Math.random() * 8) + 1;
    const gpa = (Math.random() * 2 + 2).toFixed(2); // GPA between 2.0 and 4.0
    
    additionalStudents.push({
      id: i,
      universityRegNumber: `UNI-2024-${String(i).padStart(4, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`,
      phone: `+1234567${String(i).padStart(3, '0')}`,
      program,
      department: program,
      currentSemester: semester,
      currentGPA: parseFloat(gpa),
      status: 'active',
      enrollmentDate: '2024-09-01',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
      address: `${i} Student St, City`,
      dateOfBirth: `200${Math.floor(Math.random() * 5) + 2}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      guardianName: `${firstName} Guardian`,
      guardianPhone: `+1234567${String(i + 100).padStart(3, '0')}`
    });
  }
  
  return additionalStudents;
};