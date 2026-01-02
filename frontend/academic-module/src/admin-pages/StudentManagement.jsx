import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Download,
  Trash2,
  Edit,
  Search,
  Users,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp, // ← THIS WAS MISSING! Fixed now
} from "lucide-react";

import AdminDataTable from "../components/shared/admin/AdminDataTable";
import AdminModal from "../components/shared/admin/AdminModal";
import AdminForm from "../components/shared/admin/AdminForm";
import ExportButton from "../components/shared/admin/ExportButton";
import BulkActionBar from "../components/shared/admin/BulkActionBar";
import { mockStudents } from "../mock-data/usersMock";
import "../styles/admin-pages/student-management.css";

export default function StudentManagement() {
  const [students, setStudents] = useState(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search Logic
  useEffect(() => {
    let result = [...students];

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

    setFilteredStudents(result);
  }, [searchQuery, students]);

  const columns = [
    {
      key: "universityRegNumber",
      label: "Reg Number",
      sortable: true,
      width: "140px",
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
    },
    {
      key: "currentGPA",
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
          {gpa.toFixed(2)}
        </span>
      ),
    },
    {
      key: "enrollmentDate",
      label: "Enrolled",
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span className={`status-badge status-badge--${status.toLowerCase()}`}>
          {status}
        </span>
      ),
    },
  ];

  const formFields = [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      placeholder: "Enter first name",
      required: true,
    },
    {
      name: "lastName",
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
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone",
      placeholder: "+1234567890",
    },
    {
      name: "universityRegNumber",
      type: "text",
      label: "Registration Number",
      placeholder: "e.g., 20230001",
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
        "Electrical Engineering",
        "Business Administration",
        "Physics",
        "Chemistry",
      ],
    },
    {
      name: "enrollmentDate",
      type: "date",
      label: "Enrollment Date",
      required: true,
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      options: ["Active", "Inactive", "Graduated", "Suspended"],
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
      const newStudent = {
        id: students.length + 1,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}${formData.lastName}`,
        currentGPA: 0.0,
        currentSemester: 1,
        ...formData,
      };
      setStudents([...students, newStudent]);
    } else {
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
      case "delete":
        setStudents(students.filter((s) => !selectedIds.includes(s.id)));
        setSelectedRows([]);
        break;
      default:
        break;
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting students as ${format}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="student-management"
    >
      {/* Header */}
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

      {/* Stats */}
      <div className="student-management__stats">
        <div className="stat-card">
          <div className="stat-card__icon">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <GraduationCap size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Active Students</h3>
            <p>{students.filter((s) => s.status === "Active").length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <TrendingUp size={24} /> {/* Now works! */}
          </div>
          <div className="stat-card__content">
            <h3>Average GPA</h3>
            <p>
              {students.length > 0
                ? (
                    students.reduce((sum, s) => sum + s.currentGPA, 0) /
                    students.length
                  ).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
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

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        onAction={handleBulkAction}
        show={selectedRows.length > 0}
      />

      {/* Table */}
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
              onClick: (row) => {
                if (
                  window.confirm(`Delete ${row.firstName} ${row.lastName}?`)
                ) {
                  setStudents(students.filter((s) => s.id !== row.id));
                }
              },
            },
          ]}
          loading={loading}
          emptyMessage="No students found"
        />
      </div>

      {/* Modal */}
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
                      className={`status-badge status-badge--${selectedStudent?.status.toLowerCase()}`}
                    >
                      {selectedStudent?.status}
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
                      <strong>Program:</strong> {selectedStudent?.program}
                    </div>
                    <div>
                      <strong>Semester:</strong>{" "}
                      {selectedStudent?.currentSemester}
                    </div>
                    <div>
                      <strong>GPA:</strong>{" "}
                      {selectedStudent?.currentGPA.toFixed(2)}
                    </div>
                    <div>
                      <strong>Enrolled:</strong>{" "}
                      {new Date(
                        selectedStudent?.enrollmentDate
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
