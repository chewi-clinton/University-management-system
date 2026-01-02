import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Video,
  Image,
  File,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  Lock,
  Unlock,
  Edit3,
  Trash2,
  FolderOpen,
  Grid,
  List,
  MoreVertical,
  Clock,
  Star,
  Share2,
  ChevronDown,
  X,
  Archive,
  Tags,
  Paperclip,
} from "lucide-react";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/MaterialsManagement.css";

export default function MaterialsManagement() {
  const [selectedView, setSelectedView] = useState("grid");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterAccess, setFilterAccess] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Data states
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalSize: "0 GB",
    totalDownloads: 0,
    recentUploads: 0,
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offering_id: "",
    file_type: "lecture_notes",
    access_level: "enrolled_only",
    tags: "",
    file: null,
    notify_students: false,
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [materialsRes, coursesRes, offeringsRes, statsRes] =
        await Promise.all([
          adminService.getStudyMaterials(),
          adminService.getCourses(),
          adminService.getCourseOfferings(),
          adminService.getStudyMaterialStats(),
        ]);

      if (materialsRes.success) {
        // Transform backend data to frontend format
        const transformedMaterials = materialsRes.data.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description || "",
          course: m.offering?.course
            ? `${m.offering.course.course_code} - ${m.offering.course.course_name}`
            : "N/A",
          type: getFileTypeCategory(m.file_type),
          fileType: getFileExtension(m.file_path),
          size: adminService.formatFileSize(m.file_size || 0),
          duration: m.duration || null,
          uploadedBy: m.uploaded_by_faculty
            ? `${m.uploaded_by_faculty.user?.first_name || ""} ${
                m.uploaded_by_faculty.user?.last_name || ""
              }`
            : "N/A",
          uploadDate: m.uploaded_at,
          lastModified: m.uploaded_at,
          downloads: m.download_count || 0,
          views: m.view_count || 0,
          accessLevel: m.access_level === "public" ? "public" : "enrolled",
          tags: m.tags ? m.tags.split(",").map((t) => t.trim()) : [],
          isStarred: false, // You can add this field to backend if needed
          thumbnail: null,
          filePath: m.file_path,
          isVisible: m.is_visible,
        }));
        setMaterials(transformedMaterials);
      }

      if (coursesRes.success) {
        setCourses(coursesRes.data);
      }

      if (offeringsRes.success) {
        setCourseOfferings(offeringsRes.data);
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      setError("Failed to load materials. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getFileTypeCategory = (fileType) => {
    const mapping = {
      lecture_notes: "document",
      assignment: "document",
      syllabus: "document",
      book: "document",
      video_lecture: "video",
      tutorial: "video",
      presentation: "document",
      code: "archive",
      dataset: "archive",
      other: "document",
    };
    return mapping[fileType] || "document";
  };

  const getFileExtension = (filePath) => {
    if (!filePath) return "file";
    const extension = filePath.split(".").pop().toLowerCase();
    return extension || "file";
  };

  // Filter materials
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType = filterType === "all" || material.type === filterType;
    const matchesCourse =
      filterCourse === "all" || material.course.includes(filterCourse);
    const matchesAccess =
      filterAccess === "all" || material.accessLevel === filterAccess;

    return matchesSearch && matchesType && matchesCourse && matchesAccess;
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please select a file to upload");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare data for API
      const uploadData = {
        title: formData.title,
        description: formData.description,
        offering_id: formData.offering_id,
        file_type: formData.file_type,
        access_level: formData.access_level,
        tags: formData.tags,
        file: formData.file,
        is_visible: true,
      };

      const result = await adminService.createStudyMaterial(uploadData);

      if (result.success) {
        setShowUploadModal(false);
        setFormData({
          title: "",
          description: "",
          offering_id: "",
          file_type: "lecture_notes",
          access_level: "enrolled_only",
          tags: "",
          file: null,
          notify_students: false,
        });
        await loadData();
        alert("Material uploaded successfully!");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to upload material. Please try again.");
      console.error("Error uploading material:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (materialId, fileName) => {
    try {
      const result = await adminService.downloadStudyMaterial(materialId);
      if (result.success) {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Failed to download material");
      console.error("Error downloading:", err);
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      const result = await adminService.deleteStudyMaterial(materialId);
      if (result.success) {
        await loadData();
        setSelectedMaterial(null);
        alert("Material deleted successfully!");
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Failed to delete material");
      console.error("Error deleting:", err);
    }
  };

  const getFileIcon = (type, fileType) => {
    switch (type) {
      case "document":
        return <FileText size={20} />;
      case "video":
        return <Video size={20} />;
      case "image":
        return <Image size={20} />;
      case "archive":
        return <Archive size={20} />;
      default:
        return <File size={20} />;
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case "document":
        return "#3b82f6";
      case "video":
        return "#ef4444";
      case "image":
        return "#8b5cf6";
      case "archive":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleStar = (id) => {
    setMaterials(
      materials.map((m) =>
        m.id === id ? { ...m, isStarred: !m.isStarred } : m
      )
    );
  };

  if (loading) {
    return (
      <div className="materials-management">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div className="spinner">Loading materials...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="materials-management"
    >
      {/* Header */}
      <div className="mm-header">
        <div>
          <h1 className="mm-title">Materials Management</h1>
          <p className="mm-subtitle">
            Manage study materials and educational resources
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload size={20} /> Upload Material
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            padding: "15px",
            background: "#fee",
            color: "#c00",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="mm-stats">
        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#dbeafe", color: "#3b82f6" }}
          >
            <FolderOpen size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalMaterials}</div>
            <div className="stat-label">Total Materials</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#fef3c7", color: "#f59e0b" }}
          >
            <Archive size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalSize}</div>
            <div className="stat-label">Total Size</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#dcfce7", color: "#10b981" }}
          >
            <Download size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <div className="stat-label">Total Downloads</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#e0e7ff", color: "#6366f1" }}
          >
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.recentUploads}</div>
            <div className="stat-label">Recent Uploads</div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="mm-controls">
        <div className="mm-search">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search materials, courses, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="mm-actions">
          <div className="filter-dropdown">
            <button
              className="btn-filter"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} />
            </button>

            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  className="filter-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="filter-section">
                    <label>Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="document">Documents</option>
                      <option value="video">Videos</option>
                      <option value="image">Images</option>
                      <option value="archive">Archives</option>
                    </select>
                  </div>

                  <div className="filter-section">
                    <label>Course</label>
                    <select
                      value={filterCourse}
                      onChange={(e) => setFilterCourse(e.target.value)}
                    >
                      <option value="all">All Courses</option>
                      {courses.map((course) => (
                        <option
                          key={course.course_id}
                          value={course.course_code}
                        >
                          {course.course_code} - {course.course_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-section">
                    <label>Access Level</label>
                    <select
                      value={filterAccess}
                      onChange={(e) => setFilterAccess(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="public">Public</option>
                      <option value="enrolled">Enrolled Students</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${
                selectedView === "grid" ? "view-btn--active" : ""
              }`}
              onClick={() => setSelectedView("grid")}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${
                selectedView === "list" ? "view-btn--active" : ""
              }`}
              onClick={() => setSelectedView("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Materials Grid/List */}
      <div
        className={`mm-materials ${
          selectedView === "list" ? "mm-materials--list" : ""
        }`}
      >
        {filteredMaterials.map((material) => (
          <motion.div
            key={material.id}
            className={`material-card ${
              selectedView === "list" ? "material-card--list" : ""
            }`}
            onClick={() => setSelectedMaterial(material)}
            whileHover={{ y: -4 }}
            layout
          >
            {/* Card Header */}
            <div className="material-header">
              <div
                className="material-icon"
                style={{
                  background: `${getFileColor(material.type)}15`,
                  color: getFileColor(material.type),
                }}
              >
                {getFileIcon(material.type, material.fileType)}
              </div>
              <div className="material-actions">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(material.id);
                  }}
                >
                  <Star
                    size={16}
                    fill={material.isStarred ? "#f59e0b" : "none"}
                    color={material.isStarred ? "#f59e0b" : "#9ca3af"}
                  />
                </button>
                <button className="action-btn">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="material-content">
              <h3 className="material-title">{material.title}</h3>
              <p className="material-description">{material.description}</p>

              <div className="material-meta">
                <span
                  className="meta-badge"
                  style={{
                    background: `${getFileColor(material.type)}15`,
                    color: getFileColor(material.type),
                  }}
                >
                  {material.fileType.toUpperCase()}
                </span>
                <span className="meta-text">{material.size}</span>
                {material.duration && (
                  <span className="meta-text">
                    <Clock size={14} /> {material.duration}
                  </span>
                )}
              </div>

              <div className="material-course">
                <BookOpen size={14} />
                <span>{material.course}</span>
              </div>

              <div className="material-tags">
                {material.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag">
                    <Tags size={12} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="material-footer">
              <div className="material-stats">
                <span className="stat">
                  <Eye size={14} /> {material.views}
                </span>
                <span className="stat">
                  <Download size={14} /> {material.downloads}
                </span>
              </div>
              <div className="material-access">
                {material.accessLevel === "public" ? (
                  <Unlock size={14} />
                ) : (
                  <Lock size={14} />
                )}
              </div>
            </div>

            {/* Uploaded By */}
            <div className="material-uploaded">
              <User size={14} />
              <span>{material.uploadedBy}</span>
              <span className="upload-date">
                {formatDate(material.uploadDate)}
              </span>
            </div>
          </motion.div>
        ))}

        {filteredMaterials.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <FolderOpen size={64} />
            </div>
            <h3>No materials found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleUploadMaterial}>
                <div className="modal-header">
                  <h2>Upload New Material</h2>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => setShowUploadModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  {/* File Input */}
                  <div className="upload-area">
                    <Upload size={48} />
                    <h3>Select a file to upload</h3>
                    <input
                      type="file"
                      name="file"
                      onChange={handleFormChange}
                      style={{ display: "none" }}
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="btn-secondary">
                      <Paperclip size={18} /> Choose File
                    </label>
                    {formData.file && (
                      <p style={{ marginTop: "10px", color: "#10b981" }}>
                        Selected: {formData.file.name}
                      </p>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Enter material title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      placeholder="Add a description..."
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Course Offering *</label>
                      <select
                        name="offering_id"
                        value={formData.offering_id}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select Course Offering</option>
                        {courseOfferings.map((offering) => (
                          <option key={offering.id} value={offering.id}>
                            {offering.course?.course_code} -{" "}
                            {offering.course?.course_name} ({offering.section})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Type *</label>
                      <select
                        name="file_type"
                        value={formData.file_type}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="lecture_notes">Lecture Notes</option>
                        <option value="assignment">Assignment</option>
                        <option value="syllabus">Syllabus</option>
                        <option value="book">Book</option>
                        <option value="video_lecture">Video Lecture</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="presentation">Presentation</option>
                        <option value="code">Code/Project</option>
                        <option value="dataset">Dataset</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Access Level *</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="access_level"
                          value="public"
                          checked={formData.access_level === "public"}
                          onChange={handleFormChange}
                        />
                        <Unlock size={16} />
                        <span>Public - Anyone can access</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="access_level"
                          value="enrolled_only"
                          checked={formData.access_level === "enrolled_only"}
                          onChange={handleFormChange}
                        />
                        <Lock size={16} />
                        <span>Enrolled Students - Only enrolled students</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleFormChange}
                      placeholder="Add tags (comma separated)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notify_students"
                        checked={formData.notify_students}
                        onChange={handleFormChange}
                      />
                      <span>Notify enrolled students</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowUploadModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                  >
                    <Upload size={18} />{" "}
                    {submitting ? "Uploading..." : "Upload Material"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Material Detail Modal */}
      <AnimatePresence>
        {selectedMaterial && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMaterial(null)}
          >
            <motion.div
              className="modal modal--large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div
                  className="detail-header-icon"
                  style={{
                    background: `${getFileColor(selectedMaterial.type)}15`,
                    color: getFileColor(selectedMaterial.type),
                  }}
                >
                  {getFileIcon(
                    selectedMaterial.type,
                    selectedMaterial.fileType
                  )}
                </div>
                <div className="detail-header-content">
                  <h2>{selectedMaterial.title}</h2>
                  <p>{selectedMaterial.course}</p>
                </div>
                <button
                  className="modal-close"
                  onClick={() => setSelectedMaterial(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{selectedMaterial.description}</p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <label>File Type</label>
                    <div className="detail-value">
                      {getFileIcon(
                        selectedMaterial.type,
                        selectedMaterial.fileType
                      )}
                      <span>{selectedMaterial.fileType.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>File Size</label>
                    <div className="detail-value">
                      <Archive size={16} />
                      <span>{selectedMaterial.size}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Uploaded By</label>
                    <div className="detail-value">
                      <User size={16} />
                      <span>{selectedMaterial.uploadedBy}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Upload Date</label>
                    <div className="detail-value">
                      <Calendar size={16} />
                      <span>{formatDate(selectedMaterial.uploadDate)}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Downloads</label>
                    <div className="detail-value">
                      <Download size={16} />
                      <span>{selectedMaterial.downloads}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Views</label>
                    <div className="detail-value">
                      <Eye size={16} />
                      <span>{selectedMaterial.views}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Access Level</label>
                    <div className="detail-value">
                      {selectedMaterial.accessLevel === "public" ? (
                        <>
                          <Unlock size={16} /> <span>Public</span>
                        </>
                      ) : (
                        <>
                          <Lock size={16} /> <span>Enrolled Students</span>
                        </>
                      )}
                    </div>
                  </div>

                  {selectedMaterial.duration && (
                    <div className="detail-item">
                      <label>Duration</label>
                      <div className="detail-value">
                        <Clock size={16} />
                        <span>{selectedMaterial.duration}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Tags</h3>
                  <div className="detail-tags">
                    {selectedMaterial.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        <Tags size={14} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => handleDelete(selectedMaterial.id)}
                >
                  <Trash2 size={18} /> Delete
                </button>
                <button className="btn-secondary">
                  <Share2 size={18} /> Share
                </button>
                <button
                  className="btn-primary"
                  onClick={() =>
                    handleDownload(selectedMaterial.id, selectedMaterial.title)
                  }
                >
                  <Download size={18} /> Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
