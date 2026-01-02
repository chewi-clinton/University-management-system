import { useState, useEffect } from "react";
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
  Star,
  Award,
  BookOpen,
  Users,
} from "lucide-react";

import AdminDataTable from "../components/shared/admin/AdminDataTable";
import AdminModal from "../components/shared/admin/AdminModal";
import AdminForm from "../components/shared/admin/AdminForm";
import FilterPanel, {
  SelectFilter,
} from "../components/shared/admin/FilterPanel";
import BulkActionBar from "../components/shared/admin/BulkActionBar";
import ExportButton from "../components/shared/admin/ExportButton";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/faculty-management.css";

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({
    department: "all",
    designation: "all",
    status: "all",
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  // Fetch faculty data from API
  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await adminService.getFacultyMembers();
      if (response.success) {
        // Transform backend data to match frontend structure with safe fallbacks
        const transformedData = response.data.map((f) => ({
          id: f.faculty_id,
          employeeId: f.employee_id ?? "—",
          firstName: f.user?.first_name ?? "—",
          lastName: f.user?.last_name ?? "—",
          email: f.user?.email ?? "—",
          phone: f.phone ?? "—",
          department: f.department?.department_name ?? "—",
          departmentId: f.department?.department_id ?? null,
          designation: f.designation ?? "—",
          specialization: f.specialization ?? "—",
          officeLocation: f.office_location ?? "—",
          hireDate: f.hire_date ?? null,
          isActive: f.user?.is_active ?? false,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${
            (f.user?.first_name ?? "") + (f.user?.last_name ?? "")
          }`,
          totalCourses: 0,
          totalStudents: 0,
          averageRating: 0.0,
        }));
        setFaculty(transformedData);
        setFilteredFaculty(transformedData);
      } else {
        console.error("Failed to fetch faculty:", response.error);
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
      alert("Failed to load faculty data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await adminService.getDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Search & Filter Logic
  useEffect(() => {
    let result = [...faculty];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.firstName.toLowerCase().includes(query) ||
          f.lastName.toLowerCase().includes(query) ||
          f.employeeId.toLowerCase().includes(query) ||
          f.email.toLowerCase().includes(query) ||
          f.department.toLowerCase().includes(query) ||
          f.specialization.toLowerCase().includes(query)
      );
    }

    if (filters.department !== "all") {
      result = result.filter((f) => f.department === filters.department);
    }
    if (filters.designation !== "all") {
      result = result.filter((f) => f.designation === filters.designation);
    }
    if (filters.status !== "all") {
      result = result.filter(
        (f) => f.isActive === (filters.status === "active")
      );
    }

    setFilteredFaculty(result);
  }, [searchQuery, filters, faculty]);

  const columns = [
    {
      key: "employeeId",
      label: "Employee ID",
      sortable: true,
      width: "120px",
    },
    {
      key: "firstName",
      label: "Faculty Name",
      sortable: true,
      render: (_, faculty) => (
        <div className="faculty-cell">
          <img
            src={faculty.avatar}
            alt={`${faculty.firstName} ${faculty.lastName}`}
            className="faculty-cell__avatar"
          />
          <div>
            <div className="faculty-cell__name">
              {faculty.firstName} {faculty.lastName}
            </div>
            <div className="faculty-cell__email">{faculty.email}</div>
            <div className="faculty-cell__specialization">
              {faculty.specialization}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      render: (department) => (
        <span className="department-badge">{department}</span>
      ),
    },
    {
      key: "designation",
      label: "Designation",
      sortable: true,
      render: (designation) => (
        <span className="designation-badge">{designation}</span>
      ),
    },
    {
      key: "totalCourses",
      label: "Courses",
      sortable: true,
      render: (courses) => (
        <span className="courses-count">{courses} courses</span>
      ),
    },
    {
      key: "totalStudents",
      label: "Students",
      sortable: true,
    },
    {
      key: "averageRating",
      label: "Rating",
      sortable: true,
      render: (rating) => (
        <div className="rating-cell">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`rating-star ${
                  i < Math.floor(rating) ? "rating-star--filled" : ""
                }`}
              />
            ))}
          </div>
          <span className="rating-value">{rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (isActive) => (
        <span
          className={`status-badge status-badge--${
            isActive ? "active" : "inactive"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "hireDate",
      label: "Joined",
      sortable: true,
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
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
      placeholder: "faculty@university.edu",
      required: true,
      validation: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      },
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Enter password",
      required: modalMode === "add",
      hidden: modalMode !== "add",
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "+1234567890",
      required: true,
    },
    {
      name: "departmentId",
      type: "select",
      label: "Department",
      placeholder: "Select department",
      required: true,
      options: departments.map((dept) => ({
        value: dept.id,
        label: dept.name,
      })),
    },
    {
      name: "designation",
      type: "select",
      label: "Designation",
      placeholder: "Select designation",
      required: true,
      options: [
        "Professor",
        "Associate Professor",
        "Assistant Professor",
        "Lecturer",
        "Research Fellow",
        "Adjunct Professor",
      ],
    },
    {
      name: "specialization",
      type: "text",
      label: "Specialization",
      placeholder: "Enter area of specialization",
      required: true,
    },
    {
      name: "officeLocation",
      type: "text",
      label: "Office Location",
      placeholder: "Building, Room number",
      required: true,
    },
    {
      name: "employeeId",
      type: "text",
      label: "Employee ID",
      placeholder: "FAC-2024-001",
      required: true,
      hidden: modalMode === "edit",
    },
    {
      name: "hireDate",
      type: "date",
      label: "Hire Date",
      required: true,
    },
    {
      name: "isActive",
      type: "select",
      label: "Status",
      required: true,
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
      ],
    },
  ];

  const handleAddFaculty = () => {
    setModalMode("add");
    setSelectedFaculty(null);
    setShowModal(true);
  };

  const handleEditFaculty = (faculty) => {
    setModalMode("edit");
    setSelectedFaculty({
      ...faculty,
      departmentId: faculty.departmentId,
      officeLocation: faculty.officeLocation,
    });
    setShowModal(true);
  };

  const handleViewFaculty = (faculty) => {
    setModalMode("view");
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const handleSaveFaculty = async (formData) => {
    setLoading(true);
    try {
      if (modalMode === "add") {
        const userData = {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
          role: "faculty",
          is_active: formData.isActive === true || formData.isActive === "true",
        };

        const facultyData = {
          department_id: formData.departmentId,
          employee_id: formData.employeeId,
          phone: formData.phone,
          designation: formData.designation,
          specialization: formData.specialization,
          office_location: formData.officeLocation,
          hire_date: formData.hireDate,
        };

        const response = await adminService.createFacultyMember({
          ...userData,
          ...facultyData,
        });

        if (response.success) {
          alert("Faculty member created successfully!");
          fetchFaculty();
          setShowModal(false);
        } else {
          alert(`Error: ${response.error}`);
        }
      } else {
        const updateData = {
          department_id: formData.departmentId,
          phone: formData.phone,
          designation: formData.designation,
          specialization: formData.specialization,
          office_location: formData.officeLocation,
          hire_date: formData.hireDate,
          user: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            is_active:
              formData.isActive === true || formData.isActive === "true",
          },
        };

        const response = await adminService.updateFacultyMember(
          selectedFaculty.id,
          updateData
        );

        if (response.success) {
          alert("Faculty member updated successfully!");
          fetchFaculty();
          setShowModal(false);
        } else {
          alert(`Error: ${response.error}`);
        }
      }
    } catch (error) {
      console.error("Error saving faculty:", error);
      alert("Failed to save faculty member");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    switch (action) {
      case "export":
        console.log("Exporting faculty:", selectedIds);
        break;
      case "email":
        console.log("Sending email to faculty:", selectedIds);
        break;
      case "activate":
        for (const id of selectedIds) {
          await adminService.updateFacultyMember(id, {
            user: { is_active: true },
          });
        }
        fetchFaculty();
        break;
      case "deactivate":
        for (const id of selectedIds) {
          await adminService.updateFacultyMember(id, {
            user: { is_active: false },
          });
        }
        fetchFaculty();
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete ${selectedIds.length} faculty member(s)?`
          )
        ) {
          for (const id of selectedIds) {
            await adminService.deleteFacultyMember(id);
          }
          fetchFaculty();
          setSelectedRows([]);
        }
        break;
      default:
        break;
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting faculty as ${format}`);
  };

  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
    "Research Fellow",
    "Adjunct Professor",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="faculty-management"
    >
      {/* Header */}
      <div className="faculty-management__header">
        <div>
          <h1>Faculty Management</h1>
          <p>Manage all faculty members and their assignments</p>
        </div>
        <div className="faculty-management__header-actions">
          <ExportButton onExport={handleExport} />
          <button onClick={handleAddFaculty} className="btn btn--primary">
            <Plus size={20} />
            Add Faculty
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="faculty-management__stats">
        <div className="stat-card">
          <div className="stat-card__icon">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Faculty</h3>
            <p>{faculty.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Award size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Active Faculty</h3>
            <p>{faculty.filter((f) => f.isActive).length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Courses</h3>
            <p>{faculty.reduce((sum, f) => sum + f.totalCourses, 0)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Students</h3>
            <p>{faculty.reduce((sum, f) => sum + f.totalStudents, 0)}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="faculty-management__toolbar">
        <div className="faculty-management__search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search faculty by name, email, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="faculty-management__search-input"
          />
        </div>

        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          className="faculty-management__filters"
        >
          <SelectFilter
            value={filters.department}
            onChange={(value) => setFilters({ ...filters, department: value })}
            options={["all", ...departments.map((d) => d.name)]}
            placeholder="All Departments"
          />
          <SelectFilter
            value={filters.designation}
            onChange={(value) => setFilters({ ...filters, designation: value })}
            options={["all", ...designations]}
            placeholder="All Designations"
          />
          <SelectFilter
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            placeholder="All Status"
          />
        </FilterPanel>
      </div>

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        onAction={handleBulkAction}
        show={selectedRows.length > 0}
        actions={[
          { type: "export", label: "Export", icon: <Download size={16} /> },
          { type: "email", label: "Send Email", icon: <Mail size={16} /> },
          { type: "activate", label: "Activate", icon: <Award size={16} /> },
          {
            type: "deactivate",
            label: "Deactivate",
            icon: <Trash2 size={16} />,
          },
          { type: "delete", label: "Delete", icon: <Trash2 size={16} /> },
        ]}
      />

      {/* Data Table */}
      <div className="faculty-management__table-wrapper">
        <AdminDataTable
          columns={columns}
          data={filteredFaculty}
          onRowClick={handleViewFaculty}
          onSelectionChange={setSelectedRows}
          selectable={true}
          actions={[
            {
              type: "edit",
              label: "Edit",
              icon: <Edit size={16} />,
              onClick: handleEditFaculty,
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
              onClick: async (row) => {
                if (
                  window.confirm(`Delete ${row.firstName} ${row.lastName}?`)
                ) {
                  const response = await adminService.deleteFacultyMember(
                    row.id
                  );
                  if (response.success) {
                    alert("Faculty member deleted successfully!");
                    fetchFaculty();
                  } else {
                    alert(`Error: ${response.error}`);
                  }
                }
              },
            },
          ]}
          loading={loading}
          emptyMessage="No faculty found matching your criteria"
        />
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === "add"
            ? "Add New Faculty"
            : modalMode === "edit"
            ? "Edit Faculty"
            : "Faculty Details"
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
          <div className="faculty-details">
            <div className="faculty-details__header">
              <img
                src={
                  selectedFaculty?.avatar ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                }
                alt="Faculty"
                className="faculty-details__avatar"
              />
              <div>
                <h3>
                  {selectedFaculty?.firstName} {selectedFaculty?.lastName}
                </h3>
                <p>{selectedFaculty?.employeeId}</p>
                <span
                  className={`status-badge status-badge--${
                    selectedFaculty?.isActive ? "active" : "inactive"
                  }`}
                >
                  {selectedFaculty?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="faculty-details__info">
              <div className="faculty-details__section">
                <h4>Personal Information</h4>
                <div className="faculty-details__grid">
                  <div>
                    <strong>Email:</strong> {selectedFaculty?.email || "—"}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedFaculty?.phone || "—"}
                  </div>
                  <div>
                    <strong>Office:</strong>{" "}
                    {selectedFaculty?.officeLocation || "—"}
                  </div>
                  <div>
                    <strong>Hire Date:</strong>{" "}
                    {selectedFaculty?.hireDate
                      ? new Date(selectedFaculty.hireDate).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              </div>
              <div className="faculty-details__section">
                <h4>Academic Information</h4>
                <div className="faculty-details__grid">
                  <div>
                    <strong>Department:</strong>{" "}
                    {selectedFaculty?.department || "—"}
                  </div>
                  <div>
                    <strong>Designation:</strong>{" "}
                    {selectedFaculty?.designation || "—"}
                  </div>
                  <div>
                    <strong>Specialization:</strong>{" "}
                    {selectedFaculty?.specialization || "—"}
                  </div>
                  <div>
                    <strong>Average Rating:</strong>{" "}
                    {selectedFaculty?.averageRating?.toFixed(1) || "0.0"}/5.0
                  </div>
                </div>
              </div>
              <div className="faculty-details__section">
                <h4>Teaching Statistics</h4>
                <div className="faculty-details__grid">
                  <div>
                    <strong>Total Courses:</strong>{" "}
                    {selectedFaculty?.totalCourses ?? 0}
                  </div>
                  <div>
                    <strong>Total Students:</strong>{" "}
                    {selectedFaculty?.totalStudents ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminForm
            fields={formFields}
            onSubmit={handleSaveFaculty}
            defaultValues={selectedFaculty || { isActive: true }}
            submitButtonText={
              modalMode === "add" ? "Add Faculty" : "Update Faculty"
            }
            showResetButton={modalMode === "add"}
          />
        )}
      </AdminModal>
    </motion.div>
  );
}
