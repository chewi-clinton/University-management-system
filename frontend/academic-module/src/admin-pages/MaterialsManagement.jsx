import React, { useState } from "react";
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
  Plus,
  X,
  Check,
  AlertCircle,
  FolderPlus,
  Archive,
  Tags,
  Paperclip,
  ExternalLink,
} from "lucide-react";
import "../styles/admin-pages/MaterialsManagement.css";

// Mock Data
const mockMaterials = [
  {
    id: 1,
    title: "Introduction to Machine Learning - Lecture Notes",
    description:
      "Comprehensive notes covering supervised and unsupervised learning",
    course: "CS501 - Artificial Intelligence",
    type: "document",
    fileType: "pdf",
    size: "2.4 MB",
    uploadedBy: "Dr. Sarah Johnson",
    uploadDate: "2026-01-01T10:00:00",
    lastModified: "2026-01-01T10:00:00",
    downloads: 156,
    views: 342,
    accessLevel: "enrolled",
    tags: ["Machine Learning", "AI", "Lecture Notes"],
    isStarred: true,
    thumbnail: null,
  },
  {
    id: 2,
    title: "Database Design Tutorial Video",
    description: "Step-by-step guide on designing normalized databases",
    course: "CS302 - Database Systems",
    type: "video",
    fileType: "mp4",
    size: "125.6 MB",
    duration: "45:30",
    uploadedBy: "Prof. Michael Chen",
    uploadDate: "2025-12-30T14:00:00",
    lastModified: "2025-12-30T14:00:00",
    downloads: 89,
    views: 234,
    accessLevel: "public",
    tags: ["Database", "Tutorial", "Design"],
    isStarred: false,
    thumbnail: "https://placeholder.com/video-thumb.jpg",
  },
  {
    id: 3,
    title: "Data Structures Cheat Sheet",
    description: "Quick reference for common data structures and algorithms",
    course: "CS401 - Data Structures",
    type: "image",
    fileType: "png",
    size: "856 KB",
    uploadedBy: "Dr. Emily Davis",
    uploadDate: "2025-12-29T09:00:00",
    lastModified: "2025-12-29T09:00:00",
    downloads: 267,
    views: 445,
    accessLevel: "enrolled",
    tags: ["Data Structures", "Cheat Sheet", "Reference"],
    isStarred: true,
    thumbnail: null,
  },
  {
    id: 4,
    title: "Web Development Project Template",
    description: "Starter template with React, Node.js, and MongoDB setup",
    course: "CS201 - Web Technologies",
    type: "archive",
    fileType: "zip",
    size: "45.2 MB",
    uploadedBy: "Prof. James Wilson",
    uploadDate: "2025-12-28T11:30:00",
    lastModified: "2025-12-28T11:30:00",
    downloads: 178,
    views: 289,
    accessLevel: "enrolled",
    tags: ["Web Development", "Template", "Full Stack"],
    isStarred: false,
    thumbnail: null,
  },
  {
    id: 5,
    title: "Algorithm Analysis Assignment",
    description: "Assignment problems on time complexity analysis",
    course: "CS401 - Data Structures",
    type: "document",
    fileType: "docx",
    size: "1.2 MB",
    uploadedBy: "Dr. Sarah Johnson",
    uploadDate: "2025-12-27T16:00:00",
    lastModified: "2025-12-27T16:00:00",
    downloads: 234,
    views: 378,
    accessLevel: "enrolled",
    tags: ["Assignment", "Algorithms", "Analysis"],
    isStarred: false,
    thumbnail: null,
  },
];

const mockCourses = [
  { id: 1, code: "CS501", name: "Artificial Intelligence" },
  { id: 2, code: "CS302", name: "Database Systems" },
  { id: 3, code: "CS401", name: "Data Structures" },
  { id: 4, code: "CS201", name: "Web Technologies" },
];

const mockStats = {
  totalMaterials: 342,
  totalSize: "12.4 GB",
  totalDownloads: 8945,
  recentUploads: 23,
};

export default function MaterialsManagement() {
  const [selectedView, setSelectedView] = useState("grid");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterAccess, setFilterAccess] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [materials, setMaterials] = useState(mockMaterials);

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
            <div className="stat-value">{mockStats.totalMaterials}</div>
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
            <div className="stat-value">{mockStats.totalSize}</div>
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
              {mockStats.totalDownloads.toLocaleString()}
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
            <div className="stat-value">{mockStats.recentUploads}</div>
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
                      {mockCourses.map((course) => (
                        <option key={course.id} value={course.code}>
                          {course.code} - {course.name}
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
                {material.tags.map((tag, index) => (
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
              <div className="modal-header">
                <h2>Upload New Material</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                {/* Upload Area */}
                <div className="upload-area">
                  <Upload size={48} />
                  <h3>Drag & drop files here</h3>
                  <p>or click to browse</p>
                  <button className="btn-secondary">
                    <Paperclip size={18} /> Choose Files
                  </button>
                </div>

                {/* Form Fields */}
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" placeholder="Enter material title" />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Add a description..."
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Course *</label>
                    <select>
                      <option>Select Course</option>
                      {mockCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Type *</label>
                    <select>
                      <option>Select Type</option>
                      <option>Document</option>
                      <option>Video</option>
                      <option>Image</option>
                      <option>Archive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Access Level *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="access" value="public" />
                      <Unlock size={16} />
                      <span>Public - Anyone can access</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="access"
                        value="enrolled"
                        defaultChecked
                      />
                      <Lock size={16} />
                      <span>Enrolled Students - Only enrolled students</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="access" value="private" />
                      <Lock size={16} />
                      <span>Private - Only you can access</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <input type="text" placeholder="Add tags (comma separated)" />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Notify enrolled students</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  <Upload size={18} /> Upload Material
                </button>
              </div>
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
                <button className="btn-secondary">
                  <Share2 size={18} /> Share
                </button>
                <button className="btn-secondary">
                  <Edit3 size={18} /> Edit
                </button>
                <button className="btn-primary">
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
