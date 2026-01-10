import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Users,
  GraduationCap,
  Mail,
  TrendingUp,
} from "lucide-react";

import AdminDataTable from "../components/shared/admin/AdminDataTable";
import AdminModal from "../components/shared/admin/AdminModal";
import AdminForm from "../components/shared/admin/AdminForm";
import ExportButton from "../components/shared/admin/ExportButton";
import BulkActionBar from "../components/shared/admin/BulkActionBar";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/student-management.css";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    avgGPA: 0,
  });

  useEffect(() => {
    fetchStudents();
    fetchPrograms();
  }, []);

  useEffect(() => {
    let result = [...students];

    if (searchQuery) {
      result = result.filter(
        (s) =>
          s.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.university_reg_number
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.program_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStudents(result);
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await adminService.getStudents();
      if (response.success) {
        const studentsData = response.data.map((student) => ({
          id: student.student_id,
          student_id: student.student_id,
          first_name: student.first_name,
          last_name: student.last_name,
          university_reg_number: student.university_reg_number,
          email: student.user?.email || "N/A",
          phone: student.phone || "",
          program_name: student.program?.program_name || "N/A",
          program_id: student.program?.program_id,
          current_semester: student.current_semester || 1,
          current_gpa: parseFloat(student.current_gpa) || 0.0,
          enrollment_date: student.enrollment_date,
          current_status: student.current_status || "active",
        }));

        setStudents(studentsData);
        calculateStats(studentsData);
      } else {
        alert("Failed to load students. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("An error occurred while loading students.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await adminService.getPrograms();
      if (response.success) {
        setPrograms(response.data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const calculateStats = (studentsData) => {
    const total = studentsData.length;
    const active = studentsData.filter(
      (s) => s.current_status === "active"
    ).length;
    const avgGPA =
      total > 0
        ? studentsData.reduce((sum, s) => sum + s.current_gpa, 0) / total
        : 0;

    setStats({
      total,
      active,
      avgGPA: avgGPA.toFixed(2),
    });
  };

  const columns = [
    {
      key: "university_reg_number",
      label: "Reg Number",
      sortable: true,
      width: "140px",
    },
    {
      key: "first_name",
      label: "Student Name",
      sortable: true,
      render: (_, student) => (
        <div className="student-cell">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.first_name}${student.last_name}`}
            alt={`${student.first_name} ${student.last_name}`}
            className="student-cell__avatar"
          />
          <div>
            <div className="student-cell__name">
              {student.first_name} {student.last_name}
            </div>
            <div className="student-cell__email">{student.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "program_name",
      label: "Program",
      sortable: true,
      render: (program) => <span className="program-badge">{program}</span>,
    },
    {
      key: "current_semester",
      label: "Semester",
      sortable: true,
    },
    {
      key: "current_gpa",
      label: "GPA",
      sortable: true,
      render: (gpa) => (
        <span
          className={`gpa-display ${
            gpa >= 3.5
              ? "gpa-display--high"
              : gpa < 2.0
              ? "gpa-display--low"
              : ""
          }`}
        >
          {parseFloat(gpa).toFixed(2)}
        </span>
      ),
    },
    {
      key: "enrollment_date",
      label: "Enrolled",
      sortable: true,
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      key: "current_status",
      label: "Status",
      render: (status) => (
        <span className={`status-badge status-badge--${status?.toLowerCase()}`}>
          {status || "active"}
        </span>
      ),
    },
  ];

  const formFields = [
    {
      name: "first_name",
      type: "text",
      label: "First Name",
      placeholder: "Enter first name",
      required: true,
    },
    {
      name: "last_name",
      type: "text",
      label: "Last Name",
      placeholder: "Enter last name",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "student@university.edu",
      required: true,
      disabled: modalMode === "edit",
    },
    ...(modalMode === "add"
      ? [
          {
            name: "password",
            type: "password",
            label: "Initial Password",
            placeholder: "Minimum 6 characters",
            required: true,
          },
        ]
      : []),
    {
      name: "phone",
      type: "tel",
      label: "Phone",
      placeholder: "+1234567890",
    },
    {
      name: "university_reg_number",
      type: "text",
      label: "Registration Number",
      placeholder: "e.g., 20250001",
      required: true,
    },
    {
      name: "program_id",
      type: "select",
      label: "Program",
      placeholder: "Select program",
      required: true,
      options: programs.map((p) => ({
        value: p.program_id,
        label: p.program_name,
      })),
    },
    {
      name: "enrollment_date",
      type: "date",
      label: "Enrollment Date",
      required: true,
    },
    {
      name: "current_status",
      type: "select",
      label: "Status",
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "graduated", label: "Graduated" },
        { value: "suspended", label: "Suspended" },
      ],
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

  const handleSaveStudent = async (formData) => {
    setLoading(true);
    try {
      if (modalMode === "add") {
        if (!formData.password || formData.password.length < 6) {
          alert("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        const response = await adminService.createStudent({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          university_reg_number: formData.university_reg_number,
          program_id: formData.program_id,
          enrollment_date: formData.enrollment_date,
          current_status: formData.current_status,
        });

        if (response.success) {
          alert(
            `Student added successfully!\n\nLogin Credentials:\nEmail: ${formData.email}\nPassword: ${formData.password}\n\nPlease save these credentials securely and share them with the student.`
          );
          fetchStudents();
          setShowModal(false);
        } else {
          alert(`Failed to add student: ${response.error || "Unknown error"}`);
        }
      } else {
        const response = await adminService.updateStudent(
          selectedStudent.student_id,
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            university_reg_number: formData.university_reg_number,
            program_id: formData.program_id,
            enrollment_date: formData.enrollment_date,
            current_status: formData.current_status,
          }
        );

        if (response.success) {
          alert("Student updated successfully!");
          fetchStudents();
          setShowModal(false);
        } else {
          alert(
            `Failed to update student: ${response.error || "Unknown error"}`
          );
        }
      }
    } catch (error) {
      console.error("Error saving student:", error);
      alert("An error occurred while saving the student.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (student) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${student.first_name} ${student.last_name}?`
      )
    ) {
      try {
        const response = await adminService.deleteStudent(student.student_id);
        if (response.success) {
          alert("Student deleted successfully!");
          fetchStudents();
        } else {
          alert(`Failed to delete student: ${response.error}`);
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("An error occurred while deleting the student.");
      }
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    switch (action) {
      case "export":
        handleExport("csv");
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete ${selectedIds.length} students?`
          )
        ) {
          try {
            await Promise.all(
              selectedIds.map((id) => adminService.deleteStudent(id))
            );
            alert("Students deleted successfully!");
            fetchStudents();
            setSelectedRows([]);
          } catch (error) {
            console.error("Error deleting students:", error);
            alert("An error occurred while deleting students.");
          }
        }
        break;
      default:
        break;
    }
  };

  const handleExport = (format) => {
    const dataToExport =
      selectedRows.length > 0
        ? students.filter((s) => selectedRows.includes(s.id))
        : filteredStudents;

    if (format === "csv") {
      const headers = [
        "Reg Number",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Program",
        "Semester",
        "GPA",
        "Status",
        "Enrollment Date",
      ];

      const csvContent = [
        headers.join(","),
        ...dataToExport.map((s) =>
          [
            s.university_reg_number,
            s.first_name,
            s.last_name,
            s.email,
            s.phone || "",
            s.program_name,
            s.current_semester,
            s.current_gpa,
            s.current_status,
            s.enrollment_date,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="student-management"
    >
      <div className="student-management__header">
        <div>
          <h1>Student Management</h1>
          <p>Manage all registered students and their academic records</p>
        </div>
        <div className="student-management__header-actions">
          <ExportButton onExport={handleExport} />
          <button onClick={handleAddStudent} className="btn btn--primary">
            <Plus size={20} />
            Add Student
          </button>
        </div>
      </div>

      <div className="student-management__stats">
        <div className="stat-card">
          <div className="stat-card__icon">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Students</h3>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <GraduationCap size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Active Students</h3>
            <p>{stats.active}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Average GPA</h3>
            <p>{stats.avgGPA}</p>
          </div>
        </div>
      </div>

      <div className="student-management__toolbar">
        <div className="student-management__search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, registration number, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="student-management__search-input"
          />
        </div>
      </div>

      <BulkActionBar
        selectedCount={selectedRows.length}
        onAction={handleBulkAction}
        show={selectedRows.length > 0}
      />

      <div className="student-management__table-wrapper">
        <AdminDataTable
          columns={columns}
          data={filteredStudents}
          onRowClick={handleViewStudent}
          onSelectionChange={setSelectedRows}
          selectable={true}
          actions={[
            {
              type: "edit",
              label: "Edit",
              icon: <Edit size={16} />,
              onClick: handleEditStudent,
            },
            {
              type: "email",
              label: "Email",
              icon: <Mail size={16} />,
              onClick: (row) => window.open(`mailto:${row.email}`),
            },
            {
              type: "delete",
              label: "Delete",
              icon: <Trash2 size={16} />,
              onClick: handleDeleteStudent,
            },
          ]}
          loading={loading}
          emptyMessage="No students found"
        />
      </div>

      <AnimatePresence>
        {showModal && (
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
                document.querySelector(".admin-form")?.requestSubmit();
              }
            }}
            showFooter={modalMode !== "view"}
            size="lg"
          >
            {modalMode === "view" ? (
              <div className="student-details">
                <div className="student-details__header">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent?.first_name}${selectedStudent?.last_name}`}
                    alt="Student"
                    className="student-details__avatar"
                  />
                  <div>
                    <h3>
                      {selectedStudent?.first_name} {selectedStudent?.last_name}
                    </h3>
                    <p>{selectedStudent?.university_reg_number}</p>
                    <span
                      className={`status-badge status-badge--${selectedStudent?.current_status?.toLowerCase()}`}
                    >
                      {selectedStudent?.current_status}
                    </span>
                  </div>
                </div>
                <div className="student-details__info">
                  <div className="student-details__grid">
                    <div>
                      <strong>Email:</strong> {selectedStudent?.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedStudent?.phone || "—"}
                    </div>
                    <div>
                      <strong>Program:</strong> {selectedStudent?.program_name}
                    </div>
                    <div>
                      <strong>Semester:</strong>{" "}
                      {selectedStudent?.current_semester}
                    </div>
                    <div>
                      <strong>GPA:</strong>{" "}
                      {parseFloat(selectedStudent?.current_gpa).toFixed(2)}
                    </div>
                    <div>
                      <strong>Enrolled:</strong>{" "}
                      {new Date(
                        selectedStudent?.enrollment_date
                      ).toLocaleDateString()}
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}
