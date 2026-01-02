import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Download,
  Trash2,
  Edit,
  Search,
  Building2,
  Users,
  BookOpen,
  TrendingUp,
  Eye,
} from "lucide-react";

import AdminDataTable from "../components/shared/admin/AdminDataTable";
import AdminModal from "../components/shared/admin/AdminModal";
import AdminForm from "../components/shared/admin/AdminForm";
import ExportButton from "../components/shared/admin/ExportButton";
import BulkActionBar from "../components/shared/admin/BulkActionBar";
import { adminService } from "../services/api/adminService";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);

  // Fetch departments and related data from API
  useEffect(() => {
    fetchDepartments();
    fetchFaculties();
    fetchFacultyMembers();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDepartments();
      if (response.success) {
        // Data is already transformed in adminService
        setDepartments(response.data);
        setFilteredDepartments(response.data);
      } else {
        console.error("Failed to fetch departments:", response.error);
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("Failed to load department data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      // Fetch faculties (organizations) for dropdown
      const response = await adminService.getFaculties();
      if (response.success) {
        setFaculties(response.data);
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  const fetchFacultyMembers = async () => {
    try {
      // Fetch faculty members for department head dropdown
      const response = await adminService.getFacultyMembers();
      if (response.success) {
        setFacultyMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching faculty members:", error);
    }
  };

  // Search Logic
  useEffect(() => {
    let result = [...departments];

    if (searchQuery) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDepartments(result);
  }, [searchQuery, departments]);

  const columns = [
    {
      key: "code",
      label: "Code",
      sortable: true,
      width: "80px",
    },
    {
      key: "name",
      label: "Department Name",
      sortable: true,
      render: (_, dept) => (
        <div className="dept-cell">
          <div
            className="dept-cell__color"
            style={{ backgroundColor: dept.color }}
          />
          <div>
            <div className="dept-cell__name">{dept.name}</div>
            <div className="dept-cell__code">{dept.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: "students",
      label: "Students",
      sortable: true,
      render: (students) => (
        <div className="stat-cell">
          <Users size={16} />
          <span>{students}</span>
        </div>
      ),
    },
    {
      key: "faculty",
      label: "Faculty",
      sortable: true,
      render: (faculty) => (
        <div className="stat-cell">
          <Users size={16} />
          <span>{faculty}</span>
        </div>
      ),
    },
    {
      key: "courses",
      label: "Courses",
      sortable: true,
      render: (courses) => (
        <div className="stat-cell">
          <BookOpen size={16} />
          <span>{courses}</span>
        </div>
      ),
    },
    {
      key: "avgAttendance",
      label: "Attendance",
      sortable: true,
      render: (attendance) => (
        <div className="attendance-cell">
          <div className="attendance-bar">
            <div
              className="attendance-bar__fill"
              style={{ width: `${attendance}%` }}
            />
          </div>
          <span>{attendance}%</span>
        </div>
      ),
    },
    {
      key: "avgGPA",
      label: "Avg GPA",
      sortable: true,
      render: (gpa) => (
        <span
          className={`gpa-display ${gpa >= 3.5 ? "gpa-display--high" : ""}`}
        >
          {parseFloat(gpa).toFixed(2)}
        </span>
      ),
    },
  ];

  const formFields = [
    {
      name: "department_name",
      type: "text",
      label: "Department Name",
      placeholder: "Enter department name",
      required: true,
      validation: {
        minLength: {
          value: 3,
          message: "Department name must be at least 3 characters",
        },
      },
    },
    {
      name: "department_code",
      type: "text",
      label: "Department Code",
      placeholder: "e.g., CS, MATH",
      required: true,
      validation: {
        minLength: {
          value: 2,
          message: "Code must be at least 2 characters",
        },
        maxLength: {
          value: 10,
          message: "Code cannot exceed 10 characters",
        },
      },
    },
    {
      name: "faculty_id",
      type: "select",
      label: "Faculty (Organization)",
      placeholder: "Select faculty",
      required: true,
      options: faculties.map((f) => ({
        value: f.faculty_id,
        label: f.faculty_name,
      })),
    },
    {
      name: "head_id",
      type: "select",
      label: "Department Head",
      placeholder: "Select department head",
      required: false,
      options: facultyMembers.map((fm) => ({
        value: fm.faculty_id,
        label: `${fm.user?.first_name} ${fm.user?.last_name}`,
      })),
    },
    {
      name: "office_location",
      type: "text",
      label: "Office Location",
      placeholder: "Building, Room number",
      required: false,
    },
  ];

  const handleAddDepartment = () => {
    setModalMode("add");
    setSelectedDepartment(null);
    setShowModal(true);
  };

  const handleEditDepartment = (department) => {
    setModalMode("edit");
    // Transform data back to API format
    setSelectedDepartment({
      department_id: department.id,
      department_name: department.name,
      department_code: department.code,
      faculty_id: department.faculty_id,
      head_id: department.head_id,
      office_location: department.office_location,
    });
    setShowModal(true);
  };

  const handleViewDepartment = (department) => {
    setModalMode("view");
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleSaveDepartment = async (formData) => {
    setLoading(true);
    try {
      if (modalMode === "add") {
        const response = await adminService.createDepartment(formData);

        if (response.success) {
          alert("Department created successfully!");
          fetchDepartments(); // Refresh the list
          setShowModal(false);
        } else {
          alert(`Error: ${response.error}`);
        }
      } else {
        const response = await adminService.updateDepartment(
          selectedDepartment.department_id,
          formData
        );

        if (response.success) {
          alert("Department updated successfully!");
          fetchDepartments(); // Refresh the list
          setShowModal(false);
        } else {
          alert(`Error: ${response.error}`);
        }
      }
    } catch (error) {
      console.error("Error saving department:", error);
      alert("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    switch (action) {
      case "export":
        console.log("Exporting departments:", selectedIds);
        // Implement export functionality
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete ${selectedIds.length} department(s)?`
          )
        ) {
          for (const id of selectedIds) {
            await adminService.deleteDepartment(id);
          }
          fetchDepartments();
          setSelectedRows([]);
        }
        break;
      default:
        console.log("Unknown bulk action:", action);
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting all departments as ${format}`);
    // Implement actual export logic here (CSV, Excel, etc.)
  };

  // Calculate stats safely
  const totalStudents = departments.reduce(
    (sum, d) => sum + (d.students || 0),
    0
  );
  const totalFaculty = departments.reduce(
    (sum, d) => sum + (d.faculty || 0),
    0
  );
  const totalCourses = departments.reduce(
    (sum, d) => sum + (d.courses || 0),
    0
  );
  const avgGPA =
    departments.length > 0
      ? departments.reduce((sum, d) => sum + parseFloat(d.avgGPA || 0), 0) /
        departments.length
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="department-management"
    >
      {/* Header */}
      <div className="department-management__header">
        <div>
          <h1>Department Management</h1>
          <p>Manage university departments and their performance</p>
        </div>
        <div className="department-management__header-actions">
          <button onClick={handleAddDepartment} className="btn btn--primary">
            <Plus size={20} />
            Add Department
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="department-management__stats">
        <div className="stat-card">
          <div className="stat-card__icon">
            <Building2 size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Departments</h3>
            <p>{departments.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Students</h3>
            <p>{totalStudents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Faculty</h3>
            <p>{totalFaculty}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Average GPA</h3>
            <p>{avgGPA.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search + Export */}
      <div className="department-management__toolbar">
        <div className="department-management__search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search departments by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="department-management__search-input"
          />
        </div>
        <div className="department-management__actions">
          <ExportButton onExport={handleExport} />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        onAction={handleBulkAction}
        show={selectedRows.length > 0}
        actions={[
          {
            type: "export",
            label: "Export Selected",
            icon: <Download size={16} />,
            onClick: () => handleBulkAction("export", selectedRows),
          },
          {
            type: "delete",
            label: "Delete Selected",
            icon: <Trash2 size={16} />,
            onClick: () => {
              if (
                window.confirm(
                  `Delete ${selectedRows.length} selected departments?`
                )
              ) {
                handleBulkAction("delete", selectedRows);
              }
            },
          },
        ]}
      />

      {/* Data Table */}
      <div className="department-management__table-wrapper">
        <AdminDataTable
          columns={columns}
          data={filteredDepartments}
          onRowClick={handleViewDepartment}
          onSelectionChange={setSelectedRows}
          selectable={true}
          actions={[
            {
              type: "edit",
              label: "Edit",
              icon: <Edit size={16} />,
              onClick: (row) => handleEditDepartment(row),
            },
            {
              type: "delete",
              label: "Delete",
              icon: <Trash2 size={16} />,
              onClick: async (row) => {
                if (
                  window.confirm(`Are you sure you want to delete ${row.name}?`)
                ) {
                  const response = await adminService.deleteDepartment(row.id);
                  if (response.success) {
                    alert("Department deleted successfully!");
                    fetchDepartments();
                  } else {
                    alert(`Error: ${response.error}`);
                  }
                }
              },
            },
          ]}
          loading={loading}
          emptyMessage="No departments found"
        />
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === "add"
            ? "Add New Department"
            : modalMode === "edit"
            ? "Edit Department"
            : "Department Details"
        }
        onSave={() => {
          if (modalMode !== "view") {
            document.querySelector(".admin-form")?.requestSubmit();
          } else {
            setShowModal(false);
          }
        }}
        showFooter={modalMode !== "view"}
        size="lg"
      >
        {modalMode === "view" ? (
          <div className="department-details">
            <div className="department-details__header">
              <div
                className="department-details__color"
                style={{
                  backgroundColor: selectedDepartment?.color || "#3b82f6",
                }}
              />
              <div>
                <h3>{selectedDepartment?.name || "N/A"}</h3>
                <p>{selectedDepartment?.code || "N/A"}</p>
              </div>
            </div>
            <div className="department-details__info">
              <div className="department-details__section">
                <h4>Department Information</h4>
                <div className="department-details__grid">
                  <div>
                    <strong>Office Location:</strong>{" "}
                    {selectedDepartment?.office_location || "—"}
                  </div>
                  <div>
                    <strong>Department Head:</strong>{" "}
                    {selectedDepartment?.head_name || "—"}
                  </div>
                </div>
              </div>
              <div className="department-details__section">
                <h4>Statistics</h4>
                <div className="department-details__stats">
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedDepartment?.students ?? 0}
                    </span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedDepartment?.faculty ?? 0}
                    </span>
                    <span className="stat-label">Faculty</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedDepartment?.courses ?? 0}
                    </span>
                    <span className="stat-label">Courses</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedDepartment?.avgAttendance ?? 0}%
                    </span>
                    <span className="stat-label">Attendance</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {parseFloat(selectedDepartment?.avgGPA ?? 0).toFixed(2)}
                    </span>
                    <span className="stat-label">Avg GPA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminForm
            fields={formFields}
            onSubmit={handleSaveDepartment}
            defaultValues={selectedDepartment || {}}
            submitButtonText={
              modalMode === "add" ? "Add Department" : "Update Department"
            }
            showResetButton={modalMode === "add"}
          />
        )}
      </AdminModal>
    </motion.div>
  );
}
