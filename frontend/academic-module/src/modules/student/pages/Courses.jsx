import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen, User, ChevronRight } from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { CircularProgress } from "../../../shared/components/display/CircularProgress";
import { Input } from "../../../shared/components/forms/Input";
import { Button } from "../../../shared/components/forms/Button";
import "./courses.css";

const MOCK_COURSES = [
  {
    id: "cs301",
    code: "CS 301",
    title: "Data Structures",
    instructor: "Dr. Jane Smith",
    progress: 80,
    credits: 3,
    grade: "A",
    status: "ongoing",
    color: "#e87d26",
  },
  {
    id: "ma202",
    code: "MA 202",
    title: "Calculus II",
    instructor: "Prof. Alan Turing",
    progress: 45,
    credits: 4,
    grade: "B+",
    status: "ongoing",
    color: "#050041",
  },
  {
    id: "en101",
    code: "EN 101",
    title: "English Composition",
    instructor: "Dr. Maya Angelou",
    progress: 100,
    credits: 2,
    grade: "A",
    status: "completed",
    color: "#10b981",
  },
  {
    id: "cs302",
    code: "CS 302",
    title: "Database Systems",
    instructor: "Dr. E.F. Codd",
    progress: 60,
    credits: 3,
    grade: "B",
    status: "ongoing",
    color: "#3b82f6",
  },
  {
    id: "ph101",
    code: "PH 101",
    title: "Modern Physics",
    instructor: "Prof. R. Feynman",
    progress: 0,
    credits: 4,
    grade: "-",
    status: "ongoing",
    color: "#ef4444",
  },
];

const Courses = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesFilter = filter === "all" || course.status === filter;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppShell>
      <motion.div
        className="courses-page"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <header className="courses-header">
          <div className="title-area">
            <h1>My Courses</h1>
            <p>Manage and track your academic progress</p>
          </div>

          <div className="filter-bar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search course name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-chips">
              {["all", "ongoing", "completed"].map((f) => (
                <button
                  key={f}
                  className={`chip ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        <motion.div className="courses-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="course-card" variant="elevated">
                  <div
                    className="card-accent"
                    style={{ backgroundColor: course.color }}
                  />
                  <div className="course-card-content">
                    <div className="course-main">
                      <div className="course-header-info">
                        <span
                          className="course-code"
                          style={{ color: course.color }}
                        >
                          {course.code}
                        </span>
                        <h3 className="course-title">{course.title}</h3>
                        <div className="instructor">
                          <User size={14} />
                          <span>{course.instructor}</span>
                        </div>
                      </div>
                      <CircularProgress
                        value={course.progress}
                        size={70}
                        color={course.color}
                      />
                    </div>

                    <div className="course-stats">
                      <div className="stat">
                        <span className="stat-label">Credits</span>
                        <span className="stat-value">{course.credits}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Grade</span>
                        <span className="stat-value">{course.grade}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="view-details-btn"
                      onClick={() =>
                        (window.location.href = `/courses/${course.id}`)
                      }
                    >
                      View Details <ChevronRight size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCourses.length === 0 && !loading && (
          <div className="empty-state animate-fade-in">
            <BookOpen size={48} />
            <h3>No courses found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </motion.div>
    </AppShell>
  );
};

export default Courses;
