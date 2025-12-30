import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  File,
  Video,
  Link as LinkIcon,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  Paperclip,
  X,
} from "lucide-react";
import Container from "../components/shared/layout/Container.jsx";
import Card from "../components/shared/layout/Card.jsx";
import Button from "../components/shared/ui/Button.jsx";
import Badge from "../components/shared/ui/Badge.jsx";
import Select from "../components/shared/ui/Select.jsx";
import SearchInput from "../components/shared/ui/SearchInput.jsx";
import Skeleton from "../components/shared/feedback/skeleton.jsx";
import Modal from "../components/shared/feedback/Modal.jsx";
import "../styles/pages/Materials.css";

const mockMaterials = [
  {
    id: 1,
    courseCode: "CS301",
    courseName: "Data Structures",
    title: "Lecture Notes - Binary Trees",
    type: "pdf",
    size: "2.5 MB",
    uploadedDate: "2025-01-20",
    uploadedBy: "Dr. Jane Smith",
    downloadUrl: "#",
    description:
      "Comprehensive notes covering binary trees, BST, and traversal algorithms",
  },
  {
    id: 2,
    courseCode: "CS301",
    courseName: "Data Structures",
    title: "Assignment 1 - Array Implementation",
    type: "pdf",
    size: "450 KB",
    uploadedDate: "2025-01-18",
    uploadedBy: "Dr. Jane Smith",
    downloadUrl: "#",
    description:
      "Implementation exercises for dynamic arrays and circular buffers",
  },
  {
    id: 3,
    courseCode: "MA202",
    courseName: "Calculus II",
    title: "Integration Techniques Slides",
    type: "ppt",
    size: "5.2 MB",
    uploadedDate: "2025-01-19",
    uploadedBy: "Dr. Bob Johnson",
    downloadUrl: "#",
    description:
      "PowerPoint slides covering integration by parts and substitution",
  },
  {
    id: 4,
    courseCode: "CS301",
    courseName: "Data Structures",
    title: "Graph Algorithms Tutorial",
    type: "video",
    size: "125 MB",
    uploadedDate: "2025-01-15",
    uploadedBy: "Dr. Jane Smith",
    downloadUrl: "#",
    description: "Video tutorial demonstrating BFS and DFS implementations",
  },
  {
    id: 5,
    courseCode: "EN101",
    courseName: "English Composition",
    title: "Essay Writing Guidelines",
    type: "pdf",
    size: "1.8 MB",
    uploadedDate: "2025-01-17",
    uploadedBy: "Prof. Sarah Lee",
    downloadUrl: "#",
    description:
      "Complete guide to academic essay structure and citation formats",
  },
  {
    id: 6,
    courseCode: "MA202",
    courseName: "Calculus II",
    title: "Practice Problems Set 3",
    type: "pdf",
    size: "680 KB",
    uploadedDate: "2025-01-16",
    uploadedBy: "Dr. Bob Johnson",
    downloadUrl: "#",
    description:
      "Additional practice problems for definite and indefinite integrals",
  },
  {
    id: 7,
    courseCode: "CS301",
    courseName: "Data Structures",
    title: "Sorting Algorithms Visualization",
    type: "link",
    size: null,
    uploadedDate: "2025-01-14",
    uploadedBy: "Dr. Jane Smith",
    downloadUrl: "https://visualgo.net/sorting",
    description:
      "Interactive visualization tool for understanding sorting algorithms",
  },
  {
    id: 8,
    courseCode: "EN101",
    courseName: "English Composition",
    title: "Sample Research Papers",
    type: "pdf",
    size: "3.2 MB",
    uploadedDate: "2025-01-13",
    uploadedBy: "Prof. Sarah Lee",
    downloadUrl: "#",
    description:
      "Collection of exemplary research papers from previous students",
  },
  {
    id: 9,
    courseCode: "MA202",
    courseName: "Calculus II",
    title: "Midterm Exam Review",
    type: "video",
    size: "98 MB",
    uploadedDate: "2025-01-12",
    uploadedBy: "Dr. Bob Johnson",
    downloadUrl: "#",
    description: "Recorded review session covering all midterm topics",
  },
  {
    id: 10,
    courseCode: "CS301",
    courseName: "Data Structures",
    title: "Lab Manual - Linked Lists",
    type: "pdf",
    size: "1.5 MB",
    uploadedDate: "2025-01-11",
    uploadedBy: "Dr. Jane Smith",
    downloadUrl: "#",
    description:
      "Step-by-step lab exercises for implementing linked list operations",
  },
];

const Materials = () => {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);

  const courses = [
    { value: "all", label: "All Courses" },
    { value: "CS301", label: "CS301 - Data Structures" },
    { value: "MA202", label: "MA202 - Calculus II" },
    { value: "EN101", label: "EN101 - English Composition" },
  ];

  const fileTypes = [
    { value: "pdf", label: "PDF Documents", icon: FileText, color: "#dc2626" },
    { value: "ppt", label: "Presentations", icon: File, color: "#ea580c" },
    { value: "video", label: "Videos", icon: Video, color: "#7c3aed" },
    { value: "link", label: "Links", icon: LinkIcon, color: "#2563eb" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setMaterials(mockMaterials);
      setFilteredMaterials(mockMaterials);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = materials;

    if (selectedCourse !== "all") {
      filtered = filtered.filter((m) => m.courseCode === selectedCourse);
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((m) => selectedTypes.includes(m.type));
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  }, [selectedCourse, selectedTypes, searchQuery, materials]);

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handlePreview = (material) => {
    setPreviewMaterial(material);
    setPreviewModal(true);
  };

  const getFileIcon = (type) => {
    const typeConfig = fileTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.icon : File;
  };

  const getFileColor = (type) => {
    const typeConfig = fileTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.color : "#6b7280";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatFileSize = (size) => {
    if (!size) return "N/A";
    return size;
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  if (loading) {
    return (
      <Container>
        <div className="materials">
          <div className="materials__header">
            <Skeleton variant="text" width="300px" height="40px" />
            <Skeleton
              variant="text"
              width="400px"
              height="20px"
              style={{ marginTop: "8px" }}
            />
          </div>
          <div className="materials__layout">
            <aside className="materials__sidebar">
              <Skeleton variant="rectangular" height="400px" />
            </aside>
            <div className="materials__content">
              <Skeleton
                variant="rectangular"
                height="60px"
                style={{ marginBottom: "24px" }}
              />
              <Skeleton variant="rectangular" height="120px" count={3} />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <motion.div
        className="materials"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="materials__header">
          <div className="materials__header-content">
            <h1 className="materials__title">Study Materials</h1>
            <p className="materials__subtitle">
              Access course materials, assignments, and resources
            </p>
          </div>
          <div className="materials__stats">
            <div className="materials__stat">
              <Paperclip className="materials__stat-icon" size={20} />
              <div className="materials__stat-content">
                <span className="materials__stat-value">
                  {materials.length}
                </span>
                <span className="materials__stat-label">Total Files</span>
              </div>
            </div>
          </div>
        </div>

        <div className="materials__layout">
          {/* Sidebar Filters */}
          <motion.aside className="materials__sidebar" variants={itemVariants}>
            <Card variant="flat">
              <div className="materials__filters">
                <div className="materials__filters-header">
                  <Filter size={20} />
                  <h3 className="materials__filters-title">Filters</h3>
                  {(selectedCourse !== "all" || selectedTypes.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse("all");
                        setSelectedTypes([]);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="materials__filter-group">
                  <label className="materials__filter-label">Course</label>
                  <Select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    options={courses}
                  />
                </div>

                <div className="materials__filter-group">
                  <label className="materials__filter-label">File Type</label>
                  <div className="materials__type-filters">
                    {fileTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedTypes.includes(type.value);
                      const count = materials.filter(
                        (m) => m.type === type.value
                      ).length;

                      return (
                        <button
                          key={type.value}
                          className={`materials__type-filter ${
                            isSelected ? "materials__type-filter--active" : ""
                          }`}
                          onClick={() => handleTypeToggle(type.value)}
                          style={{
                            borderColor: isSelected ? type.color : undefined,
                            backgroundColor: isSelected
                              ? `${type.color}10`
                              : undefined,
                          }}
                        >
                          <Icon size={18} style={{ color: type.color }} />
                          <span className="materials__type-filter-label">
                            {type.label}
                          </span>
                          <Badge variant="secondary" size="sm">
                            {count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="materials__content">
            <motion.div variants={itemVariants}>
              <Card variant="flat" className="materials__search-card">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search materials, courses, or descriptions..."
                  className="materials__search"
                />
                <div className="materials__search-info">
                  Showing {filteredMaterials.length} of {materials.length}{" "}
                  materials
                </div>
              </Card>
            </motion.div>

            {filteredMaterials.length > 0 ? (
              <div className="materials__list">
                {filteredMaterials.map((material, index) => {
                  const FileIcon = getFileIcon(material.type);
                  const fileColor = getFileColor(material.type);

                  return (
                    <motion.div
                      key={material.id}
                      variants={itemVariants}
                      custom={index}
                    >
                      <Card variant="flat" className="materials__item">
                        <div
                          className="materials__item-icon"
                          style={{ backgroundColor: `${fileColor}15` }}
                        >
                          <FileIcon size={28} style={{ color: fileColor }} />
                        </div>

                        <div className="materials__item-content">
                          <div className="materials__item-header">
                            <div className="materials__item-meta">
                              <h3 className="materials__item-title">
                                {material.title}
                              </h3>
                              <div className="materials__item-tags">
                                <Badge variant="primary" size="sm">
                                  {material.courseCode}
                                </Badge>
                                <Badge variant="secondary" size="sm">
                                  {material.type.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="materials__item-description">
                            {material.description}
                          </p>

                          <div className="materials__item-footer">
                            <div className="materials__item-details">
                              <span className="materials__item-detail">
                                <Calendar size={14} />
                                {formatDate(material.uploadedDate)}
                              </span>
                              <span className="materials__item-detail">
                                By {material.uploadedBy}
                              </span>
                              {material.size && (
                                <span className="materials__item-detail">
                                  {formatFileSize(material.size)}
                                </span>
                              )}
                            </div>

                            <div className="materials__item-actions">
                              {material.type !== "link" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePreview(material)}
                                >
                                  <Eye size={16} />
                                  Preview
                                </Button>
                              )}
                              <Button variant="primary" size="sm">
                                <Download size={16} />
                                {material.type === "link"
                                  ? "Open Link"
                                  : "Download"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card variant="flat" className="materials__empty">
                <div className="materials__empty-content">
                  <Search size={64} className="materials__empty-icon" />
                  <h3 className="materials__empty-title">No Materials Found</h3>
                  <p className="materials__empty-text">
                    Try adjusting your filters or search query to find what
                    you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCourse("all");
                      setSelectedTypes([]);
                      setSearchQuery("");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {previewModal && previewMaterial && (
          <Modal
            isOpen={previewModal}
            onClose={() => setPreviewModal(false)}
            title={previewMaterial.title}
            size="lg"
          >
            <div className="materials__preview">
              <div className="materials__preview-header">
                <Badge variant="primary">{previewMaterial.courseCode}</Badge>
                <Badge variant="secondary">
                  {previewMaterial.type.toUpperCase()}
                </Badge>
              </div>

              <div className="materials__preview-info">
                <p className="materials__preview-description">
                  {previewMaterial.description}
                </p>

                <div className="materials__preview-details">
                  <div className="materials__preview-detail">
                    <span className="materials__preview-label">Course:</span>
                    <span className="materials__preview-value">
                      {previewMaterial.courseName}
                    </span>
                  </div>
                  <div className="materials__preview-detail">
                    <span className="materials__preview-label">Uploaded:</span>
                    <span className="materials__preview-value">
                      {formatDate(previewMaterial.uploadedDate)}
                    </span>
                  </div>
                  <div className="materials__preview-detail">
                    <span className="materials__preview-label">Size:</span>
                    <span className="materials__preview-value">
                      {formatFileSize(previewMaterial.size)}
                    </span>
                  </div>
                  <div className="materials__preview-detail">
                    <span className="materials__preview-label">
                      Uploaded by:
                    </span>
                    <span className="materials__preview-value">
                      {previewMaterial.uploadedBy}
                    </span>
                  </div>
                </div>
              </div>

              <div className="materials__preview-placeholder">
                <FileText
                  size={64}
                  className="materials__preview-placeholder-icon"
                />
                <p className="materials__preview-placeholder-text">
                  Preview not available. Click download to view the full file.
                </p>
              </div>

              <div className="materials__preview-actions">
                <Button
                  variant="outline"
                  onClick={() => setPreviewModal(false)}
                >
                  Close
                </Button>
                <Button variant="primary">
                  <Download size={16} />
                  Download File
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </motion.div>
    </Container>
  );
};

export default Materials;
