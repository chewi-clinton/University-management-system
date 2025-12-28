import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Video,
  Image,
  Download,
  Search,
  Filter,
  MoreVertical,
  FileCode,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { Button } from "../../../shared/components/forms/Button";
import { Badge } from "../../../shared/components/display/Badge";
import { Modal } from "../../../shared/components/feedback/Modal";
import "./materials.css";

const MOCK_MATERIALS = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    course: "CS301",
    type: "PDF",
    size: "2.4 MB",
    date: "Jan 15, 2025",
  },
  {
    id: 2,
    title: "Calculus II Formula Sheet",
    course: "MA202",
    type: "DOCX",
    size: "1.1 MB",
    date: "Jan 18, 2025",
  },
  {
    id: 3,
    title: "Database Normalization Video",
    course: "CS302",
    type: "MP4",
    size: "45 MB",
    date: "Jan 20, 2025",
  },
  {
    id: 4,
    title: "Lab 3: React Hooks Source",
    course: "CS305",
    type: "ZIP",
    size: "150 KB",
    date: "Jan 22, 2025",
  },
  {
    id: 5,
    title: "English Essay Guidelines",
    course: "EN101",
    type: "PDF",
    size: "800 KB",
    date: "Jan 23, 2025",
  },
];

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [downloadingId, setDownloadingId] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText className="text-danger" />;
      case "MP4":
        return <Video className="text-primary" />;
      case "ZIP":
        return <FileCode className="text-warning" />;
      default:
        return <FileText className="text-secondary" />;
    }
  };

  const handleDownload = (id) => {
    setDownloadingId(id);
    setTimeout(() => setDownloadingId(null), 2000); // Simulate download
  };

  const filteredMaterials = MOCK_MATERIALS.filter(
    (m) =>
      (selectedType === "All" || m.type === selectedType) &&
      (m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.course.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AppShell>
      <motion.div
        className="materials-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <header className="page-header mb-8">
          <h1>Learning Materials</h1>
          <p>
            Access and download lectures, notes, and supplemental resources.
          </p>
        </header>

        <div className="materials-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <Card className="filter-card">
              <h3 className="mb-4 flex items-center gap-2">
                <Filter size={18} /> Filters
              </h3>
              <div className="filter-group">
                <label>File Type</label>
                <div className="type-chips">
                  {["All", "PDF", "DOCX", "MP4", "ZIP"].map((type) => (
                    <button
                      key={type}
                      className={`chip ${
                        selectedType === type ? "active" : ""
                      }`}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group mt-6">
                <label>Courses</label>
                <select className="filter-select">
                  <option>All Courses</option>
                  <option>CS301 - Data Structures</option>
                  <option>MA202 - Calculus II</option>
                </select>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="materials-main">
            <div className="search-bar-container mb-6">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by filename or course code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="materials-list">
              <AnimatePresence mode="popLayout">
                {filteredMaterials.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="material-item"
                  >
                    <div className="file-preview-icon">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="file-info">
                      <div className="flex items-center gap-2">
                        <h4
                          onClick={() => setPreviewFile(file)}
                          className="clickable-title"
                        >
                          {file.title}
                        </h4>
                        <Badge variant="secondary">{file.course}</Badge>
                      </div>
                      <p className="file-meta">
                        {file.type} • {file.size} • Uploaded {file.date}
                      </p>
                    </div>
                    <div className="file-actions">
                      <Button
                        variant={
                          downloadingId === file.id ? "ghost" : "outline"
                        }
                        size="sm"
                        onClick={() => handleDownload(file.id)}
                        disabled={downloadingId === file.id}
                      >
                        {downloadingId === file.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <MoreVertical size={16} />
                          </motion.div>
                        ) : (
                          <Download size={16} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewFile(file)}
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* PDF/File Preview Modal */}
        <Modal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title={previewFile?.title}
        >
          <div className="preview-container">
            <div className="preview-placeholder">
              <FileText size={48} className="mb-4 text-gray-300" />
              <p>Preview for {previewFile?.type} files is loading...</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setPreviewFile(null)}>
                Close
              </Button>
              <Button onClick={() => handleDownload(previewFile?.id)}>
                Download Now
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </AppShell>
  );
};

export default Materials;
