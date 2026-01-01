import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Download,
  Trash2,
  Edit,
  Search,
  Filter,
  Mail,
  Phone,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AdminDataTable from "../components/shared/admin/AdminDataTable";
import AdminModal from "../components/shared/admin/AdminModal";
import AdminForm from "../components/shared/admin/AdminForm";
import FilterPanel, {
  SelectFilter,
} from "../components/shared/admin/FilterPanel";
import BulkActionBar from "../components/shared/admin/BulkActionBar";
import ExportButton from "../components/shared/admin/ExportButton";
import { mockStudents, generateMoreStudents } from "../mock-data/usersMock";
import "../styles/admin-pages/student-management.css";
export default function StudentManagement() {
  const [students, setStudents] = useState([
    ...mockStudents,
    ...generateMoreStudents(45),
  ]);
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({
    program: "all",
    status: "all",
    semester: "all",
    gpaRange: "all",
  });
  const [loading, setLoading] = useState(false);

  // Search & Filter Logic
  useEffect(() => {
    let result = [...students];

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.universityRegNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.program.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.program !== "all") {
      result = result.filter((s) => s.program === filters.program);
    }
    if (filters.status !== "all") {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters.semester !== "all") {
      result = result.filter(
        (s) => s.currentSemester.toString() === filters.semester
      );
    }
    if (filters.gpaRange !== "all") {
      const [min, max] = filters.gpaRange.split("-").map(Number);
      result = result.filter((s) => s.currentGPA >= min && s.currentGPA <= max);
    }

    setFilteredStudents(result);
  }, [searchQuery, filters, students]);

  const columns = [
    {
      key: "universityRegNumber",
      label: "Reg Number",
      sortable: true,
      width: "120px",
    },
    {
      key: "firstName",
      label: "Student Name",
      sortable: true,
      render: (_, student) => (
        <div className="student-cell">
          <img
            src={student.avatar}
            alt={`${student.firstName} ${student.lastName}`}
            className="student-cell__avatar"
          />
          <div>
            <div className="student-cell__name">
              {student.firstName} {student.lastName}
            </div>
            <div className="student-cell__email">{student.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "program",
      label: "Program",
      sortable: true,
      render: (program) => <span className="program-badge">{program}</span>,
    },
    {
      key: "currentSemester",
      label: "Semester",
      sortable: true,
      render: (semester) => (
        <span className="semester-badge">Sem {semester}</span>
      ),
    },
    {
      key: "currentGPA",
      label: "GPA",
      sortable: true,
      render: (gpa) => (
        <span
          className={`gpa-badge ${
            gpa >= 3.5
              ? "gpa-badge--high"
              : gpa >= 3.0
              ? "gpa-badge--medium"
              : "gpa-badge--low"
          }`}
        >
          {gpa.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span className={`status-badge status-badge--${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      key: "enrollmentDate",
      label: "Enrolled",
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const formFields = [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      placeholder: "Enter first name",
      required: true,
      validation: {
        minLength: {
          value: 2,
          message: "First name must be at least 2 characters",
        },
      },
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      placeholder: "Enter last name",
      required: true,
      validation: {
        minLength: {
          value: 2,
          message: "Last name must be at least 2 characters",
        },
      },
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "student@university.edu",
      required: true,
      validation: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      },
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "+1234567890",
      required: true,
    },
    {
      name: "program",
      type: "select",
      label: "Program",
      placeholder: "Select program",
      required: true,
      options: [
        "Computer Science",
        "Mathematics",
        "Engineering",
        "Business",
        "Physics",
        "Chemistry",
      ],
    },
    {
      name: "currentSemester",
      type: "number",
      label: "Current Semester",
      placeholder: "1-8",
      required: true,
      validation: {
        min: {
          value: 1,
          message: "Semester must be between 1 and 8",
        },
        max: {
          value: 8,
          message: "Semester must be between 1 and 8",
        },
      },
    },
    {
      name: "dateOfBirth",
      type: "date",
      label: "Date of Birth",
      required: true,
    },
    {
      name: "address",
      type: "textarea",
      label: "Address",
      placeholder: "Enter permanent address",
      required: true,
    },
    {
      name: "guardianName",
      type: "text",
      label: "Guardian Name",
      placeholder: "Enter guardian name",
      required: true,
    },
    {
      name: "guardianPhone",
      type: "tel",
      label: "Guardian Phone",
      placeholder: "+1234567890",
      required: true,
    },
  ];

  const handleAddStudent = () => {
    setModalMode("add");
    setSelectedStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setModalMode("edit");
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleViewStudent = (student) => {
    setModalMode("view");
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleSaveStudent = (formData) => {
    if (modalMode === "add") {
      // Add new student
      const newStudent = {
        id: students.length + 1,
        universityRegNumber: `UNI-2024-${String(students.length + 1).padStart(
          4,
          "0"
        )}`,
        ...formData,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`,
        currentGPA: 0.0,
        status: "active",
        enrollmentDate: new Date().toISOString().split("T")[0],
      };
      setStudents([...students, newStudent]);
    } else {
      // Update existing student
      setStudents(
        students.map((s) =>
          s.id === selectedStudent.id ? { ...s, ...formData } : s
        )
      );
    }
    setShowModal(false);
  };

  const handleBulkAction = (action, selectedIds) => {
    switch (action) {
      case "export":
        console.log("Exporting students:", selectedIds);
        break;
      case "email":
        console.log("Sending email to students:", selectedIds);
        break;
      case "activate":
        setStudents(
          students.map((s) =>
            selectedIds.includes(s.id) ? { ...s, status: "active" } : s
          )
        );
        break;
      case "deactivate":
        setStudents(
          students.map((s) =>
            selectedIds.includes(s.id) ? { ...s, status: "inactive" } : s
          )
        );
        break;
      case "delete":
        setStudents(students.filter((s) => !selectedIds.includes(s.id)));
        break;
      default:
        console.log("Unknown bulk action:", action);
    }
    setSelectedRows([]);
  };

  const handleExport = (format) => {
    console.log(`Exporting students as ${format}`);
    // Implement export logic
  };

  const programs = [
    "Computer Science",
    "Mathematics",
    "Engineering",
    "Business",
    "Physics",
    "Chemistry",
  ];
  const semesters = Array.from({ length: 8 }, (_, i) => (i + 1).toString());
  const gpaRanges = [
    { value: "all", label: "All GPAs" },
    { value: "3.5-4.0", label: "3.5 - 4.0" },
    { value: "3.0-3.49", label: "3.0 - 3.49" },
    { value: "2.5-2.99", label: "2.5 - 2.99" },
    { value: "2.0-2.49", label: "2.0 - 2.49" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="student-management"
    >
      {/* Header */}
      <div className="student-management__header">
        <div>
          <h1>Student Management</h1>
          <p>Manage all registered students in the university</p>
        </div>
        <div className="student-management__header-actions">
          <ExportButton onExport={handleExport} />
          <button onClick={handleAddStudent} className="btn btn--primary">
            <Plus size={20} />
            Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="student-management__toolbar">
        <div className="student-management__search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search students by name, email, or registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="student-management__search-input"
          />
        </div>

        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          className="student-management__filters"
        >
          <SelectFilter
            value={filters.program}
            onChange={(value) => setFilters({ ...filters, program: value })}
            options={programs}
            placeholder="All Programs"
          />

          <SelectFilter
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "graduated", label: "Graduated" },
              { value: "suspended", label: "Suspended" },
            ]}
            placeholder="All Status"
          />

          <SelectFilter
            value={filters.semester}
            onChange={(value) => setFilters({ ...filters, semester: value })}
            options={[
              { value: "all", label: "All Semesters" },
              ...semesters.map((s) => ({ value: s, label: `Semester ${s}` })),
            ]}
            placeholder="All Semesters"
          />

          <SelectFilter
            value={filters.gpaRange}
            onChange={(value) => setFilters({ ...filters, gpaRange: value })}
            options={gpaRanges}
            placeholder="All GPAs"
          />
        </FilterPanel>
      </div>

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        onAction={handleBulkAction}
        show={selectedRows.length > 0}
      />

      {/* Data Table */}
      <div className="student-management__table-wrapper">
        <AdminDataTable
          columns={columns}
          data={filteredStudents}
          onRowClick={handleViewStudent}
          onBulkAction={handleBulkAction}
          selectable={true}
          actions={[
            {
              type: "edit",
              label: "Edit",
              icon: <Edit size={16} />,
              onClick: (row) => handleEditStudent(row),
            },
            {
              type: "email",
              label: "Email",
              icon: <Mail size={16} />,
              onClick: (row) => console.log("Email student:", row.email),
            },
            {
              type: "delete",
              label: "Delete",
              icon: <Trash2 size={16} />,
              onClick: (row) => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${row.firstName} ${row.lastName}?`
                  )
                ) {
                  setStudents(students.filter((s) => s.id !== row.id));
                }
              },
            },
          ]}
          loading={loading}
          emptyMessage="No students found matching your criteria"
        />
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === "add"
            ? "Add New Student"
            : modalMode === "edit"
            ? "Edit Student"
            : "Student Details"
        }
        onSave={() => {
          if (modalMode !== "view") {
            // Form submission will be handled by AdminForm
            document.querySelector(".admin-form")?.requestSubmit();
          } else {
            setShowModal(false);
          }
        }}
        showFooter={modalMode !== "view"}
        size="lg"
      >
        {modalMode === "view" ? (
          <div className="student-details">
            <div className="student-details__header">
              <img
                src={selectedStudent?.avatar}
                alt="Student"
                className="student-details__avatar"
              />
              <div>
                <h3>
                  {selectedStudent?.firstName} {selectedStudent?.lastName}
                </h3>
                <p>{selectedStudent?.universityRegNumber}</p>
                <span
                  className={`status-badge status-badge--${selectedStudent?.status}`}
                >
                  {selectedStudent?.status}
                </span>
              </div>
            </div>
            <div className="student-details__info">
              <div className="student-details__section">
                <h4>Personal Information</h4>
                <div className="student-details__grid">
                  <div>
                    <strong>Email:</strong> {selectedStudent?.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedStudent?.phone}
                  </div>
                  <div>
                    <strong>Date of Birth:</strong>{" "}
                    {selectedStudent?.dateOfBirth}
                  </div>
                  <div>
                    <strong>Address:</strong> {selectedStudent?.address}
                  </div>
                </div>
              </div>
              <div className="student-details__section">
                <h4>Academic Information</h4>
                <div className="student-details__grid">
                  <div>
                    <strong>Program:</strong> {selectedStudent?.program}
                  </div>
                  <div>
                    <strong>Semester:</strong>{" "}
                    {selectedStudent?.currentSemester}
                  </div>
                  <div>
                    <strong>GPA:</strong> {selectedStudent?.currentGPA}
                  </div>
                  <div>
                    <strong>Enrollment Date:</strong>{" "}
                    {selectedStudent?.enrollmentDate}
                  </div>
                </div>
              </div>
              <div className="student-details__section">
                <h4>Emergency Contact</h4>
                <div className="student-details__grid">
                  <div>
                    <strong>Guardian:</strong> {selectedStudent?.guardianName}
                  </div>
                  <div>
                    <strong>Guardian Phone:</strong>{" "}
                    {selectedStudent?.guardianPhone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminForm
            fields={formFields}
            onSubmit={handleSaveStudent}
            defaultValues={selectedStudent || {}}
            submitButtonText={
              modalMode === "add" ? "Add Student" : "Update Student"
            }
            showResetButton={modalMode === "add"}
          />
        )}
      </AdminModal>
    </motion.div>
  );
}
