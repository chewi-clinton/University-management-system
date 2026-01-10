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
  AlertCircle,
} from "lucide-react";
import Container from "../components/shared/layout/Container.jsx";
import Card from "../components/shared/layout/Card.jsx";
import Button from "../components/shared/ui/Button.jsx";
import Badge from "../components/shared/ui/Badge.jsx";
import Select from "../components/shared/ui/Select.jsx";
import SearchInput from "../components/shared/ui/SearchInput.jsx";
import Skeleton from "../components/shared/feedback/Skeleton.jsx";
import Modal from "../components/shared/feedback/Modal.jsx";
import { studentService } from "../services/api/studentService.js";
import "../styles/pages/materials.css";

const Materials = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);

  const fileTypes = [
    { value: "pdf", label: "PDF Documents", icon: FileText, color: "#dc2626" },
    { value: "ppt", label: "Presentations", icon: File, color: "#ea580c" },
    { value: "pptx", label: "Presentations", icon: File, color: "#ea580c" },
    { value: "doc", label: "Documents", icon: File, color: "#2563eb" },
    { value: "docx", label: "Documents", icon: File, color: "#2563eb" },
    { value: "video", label: "Videos", icon: Video, color: "#7c3aed" },
    { value: "mp4", label: "Videos", icon: Video, color: "#7c3aed" },
    { value: "link", label: "Links", icon: LinkIcon, color: "#2563eb" },
    { value: "zip", label: "Archives", icon: File, color: "#059669" },
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get student's registered courses
      const coursesResponse = await studentService.getCourses();
      console.log("Courses response:", coursesResponse);

      if (!coursesResponse.success) {
        throw new Error(coursesResponse.error || "Failed to load courses");
      }

      const registeredCourses = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : coursesResponse.data?.results || [];

      // Build courses dropdown options
      const courseOptions = [
        { value: "all", label: "All Courses" },
        ...registeredCourses.map((course) => ({
          value: course.offering?.id?.toString() || course.id?.toString(),
          label: `${course.offering?.course?.course_code || "N/A"} - ${
            course.offering?.course?.course_name || "Unknown Course"
          }`,
        })),
      ];
      setCourses(courseOptions);

      // Fetch materials for all registered courses
      const allMaterials = [];

      for (const course of registeredCourses) {
        const offeringId = course.offering?.id;

        if (offeringId) {
          try {
            const materialsResponse = await studentService.getCourseMaterials(
              offeringId
            );
            console.log(
              `Materials for offering ${offeringId}:`,
              materialsResponse
            );

            if (materialsResponse.success) {
              const courseMaterials = Array.isArray(materialsResponse.data)
                ? materialsResponse.data
                : materialsResponse.data?.results || [];

              // Add course information to each material
              const materialsWithCourseInfo = courseMaterials.map(
                (material) => ({
                  ...material,
                  courseInfo: course.offering,
                  courseCode: course.offering?.course?.course_code || "N/A",
                  courseName:
                    course.offering?.course?.course_name || "Unknown Course",
                })
              );

              allMaterials.push(...materialsWithCourseInfo);
            }
          } catch (err) {
            console.error(
              `Error fetching materials for offering ${offeringId}:`,
              err
            );
          }
        }
      }

      console.log("All materials:", allMaterials);

      // Sort materials by upload date (most recent first)
      allMaterials.sort((a, b) => {
        const dateA = new Date(a.uploaded_at || a.created_at);
        const dateB = new Date(b.uploaded_at || b.created_at);
        return dateB - dateA;
      });

      setMaterials(allMaterials);
      setFilteredMaterials(allMaterials);
    } catch (err) {
      console.error("Error fetching materials:", err);
      setError(err.message || "Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = materials;

    if (selectedCourse !== "all") {
      filtered = filtered.filter(
        (m) => m.courseInfo?.id?.toString() === selectedCourse
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((m) => {
        const fileType = getFileType(m.file_type || m.file_url);
        return selectedTypes.includes(fileType);
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  }, [selectedCourse, selectedTypes, searchQuery, materials]);

  const getFileType = (fileTypeOrUrl) => {
    if (!fileTypeOrUrl) return "file";

    // If it's a URL, extract file extension
    if (fileTypeOrUrl.startsWith("http")) {
      const extension = fileTypeOrUrl
        .split(".")
        .pop()
        .split("?")[0]
        .toLowerCase();
      return extension;
    }

    return fileTypeOrUrl.toLowerCase();
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handlePreview = (material) => {
    setPreviewMaterial(material);
    setPreviewModal(true);
  };

  const handleDownload = (material) => {
    if (material.file_url || material.file) {
      const url = material.file_url || material.file;
      window.open(url, "_blank", "noopener,noreferrer");
    }
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
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";

    // If it's already formatted, return as-is
    if (typeof bytes === "string" && bytes.includes("MB")) {
      return bytes;
    }

    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
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

  // Get unique file types from materials
  const getUniqueFileTypes = () => {
    const types = materials.map((m) => getFileType(m.file_type || m.file_url));
    const uniqueTypes = [...new Set(types)];

    return fileTypes
      .filter((ft) => uniqueTypes.includes(ft.value))
      .map((ft) => {
        const count = materials.filter(
          (m) => getFileType(m.file_type || m.file_url) === ft.value
        ).length;
        return { ...ft, count };
      });
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

  if (error) {
    return (
      <Container>
        <div className="materials">
          <Card variant="flat" className="materials__error">
            <AlertCircle
              size={48}
              style={{ color: "#ef4444", marginBottom: "16px" }}
            />
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Failed to Load Materials
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>{error}</p>
            <Button variant="primary" onClick={fetchMaterials}>
              Retry
            </Button>
          </Card>
        </div>
      </Container>
    );
  }

  const availableFileTypes = getUniqueFileTypes();

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

                {availableFileTypes.length > 0 && (
                  <div className="materials__filter-group">
                    <label className="materials__filter-label">File Type</label>
                    <div className="materials__type-filters">
                      {availableFileTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedTypes.includes(type.value);

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
                              {type.count}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                  const fileType = getFileType(
                    material.file_type || material.file_url
                  );
                  const FileIcon = getFileIcon(fileType);
                  const fileColor = getFileColor(fileType);

                  return (
                    <motion.div
                      key={material.material_id || material.id}
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
                                {material.title || "Untitled Material"}
                              </h3>
                              <div className="materials__item-tags">
                                <Badge variant="primary" size="sm">
                                  {material.courseCode}
                                </Badge>
                                <Badge variant="secondary" size="sm">
                                  {fileType.toUpperCase()}
                                </Badge>
                                {material.access_level && (
                                  <Badge variant="success" size="sm">
                                    {material.access_level}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {material.description && (
                            <p className="materials__item-description">
                              {material.description}
                            </p>
                          )}

                          <div className="materials__item-footer">
                            <div className="materials__item-details">
                              <span className="materials__item-detail">
                                <Calendar size={14} />
                                {formatDate(
                                  material.uploaded_at || material.created_at
                                )}
                              </span>
                              {material.uploaded_by_faculty && (
                                <span className="materials__item-detail">
                                  By{" "}
                                  {
                                    material.uploaded_by_faculty.user
                                      ?.first_name
                                  }{" "}
                                  {material.uploaded_by_faculty.user?.last_name}
                                </span>
                              )}
                              {material.file_size && (
                                <span className="materials__item-detail">
                                  {formatFileSize(material.file_size)}
                                </span>
                              )}
                            </div>

                            <div className="materials__item-actions">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePreview(material)}
                              >
                                <Eye size={16} />
                                Preview
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleDownload(material)}
                              >
                                <Download size={16} />
                                {material.file_url?.startsWith("http") &&
                                !material.file_url?.includes("/media/")
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
                    {materials.length === 0
                      ? "No study materials have been uploaded yet."
                      : "Try adjusting your filters or search query to find what you're looking for."}
                  </p>
                  {materials.length > 0 && (
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
                  )}
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
            title={previewMaterial.title || "Material Preview"}
            size="lg"
          >
            <div className="materials__preview">
              <div className="materials__preview-header">
                <Badge variant="primary">{previewMaterial.courseCode}</Badge>
                <Badge variant="secondary">
                  {getFileType(
                    previewMaterial.file_type || previewMaterial.file_url
                  ).toUpperCase()}
                </Badge>
              </div>

              <div className="materials__preview-info">
                {previewMaterial.description && (
                  <p className="materials__preview-description">
                    {previewMaterial.description}
                  </p>
                )}

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
                      {formatDate(
                        previewMaterial.uploaded_at ||
                          previewMaterial.created_at
                      )}
                    </span>
                  </div>
                  {previewMaterial.file_size && (
                    <div className="materials__preview-detail">
                      <span className="materials__preview-label">Size:</span>
                      <span className="materials__preview-value">
                        {formatFileSize(previewMaterial.file_size)}
                      </span>
                    </div>
                  )}
                  {previewMaterial.uploaded_by_faculty && (
                    <div className="materials__preview-detail">
                      <span className="materials__preview-label">
                        Uploaded by:
                      </span>
                      <span className="materials__preview-value">
                        {previewMaterial.uploaded_by_faculty.user?.first_name}{" "}
                        {previewMaterial.uploaded_by_faculty.user?.last_name}
                      </span>
                    </div>
                  )}
                  {previewMaterial.access_level && (
                    <div className="materials__preview-detail">
                      <span className="materials__preview-label">
                        Access Level:
                      </span>
                      <span className="materials__preview-value">
                        {previewMaterial.access_level}
                      </span>
                    </div>
                  )}
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
                <Button
                  variant="primary"
                  onClick={() => handleDownload(previewMaterial)}
                >
                  <Download size={16} />
                  {previewMaterial.file_url?.startsWith("http") &&
                  !previewMaterial.file_url?.includes("/media/")
                    ? "Open Link"
                    : "Download File"}
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
