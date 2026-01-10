import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "../../components/shared/layout/Card";
import Select from "../../components/shared/ui/Select";
import Button from "../../components/shared/ui/Button";
import DatePicker from "../../components/shared/ui/DatePicker";
import LineChart from "../../components/shared/charts/LineChart";
import BarChart from "../../components/shared/charts/BarChart";
import PieChart from "../../components/shared/charts/PieChart";
import Table from "../../components/shared/ui/Table";
import Skeleton from "../../components/shared/feedback/Skeleton";
import facultyService from "../../services/api/facultyService";
import api from "../../services/api/api";
import "../../styles/pages/Reports.css";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("course-performance");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [dateFrom, setDateFrom] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  // Clear report when no course is selected
  useEffect(() => {
    if (!selectedCourse) {
      setReportData(null);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse) {
      generateReport();
    }
  }, [reportType, selectedCourse, dateFrom, dateTo]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await facultyService.getCourses({ is_visible: true });

      // Safely extract the courses array
      let rawCourses = response?.results ?? response ?? [];
      if (!Array.isArray(rawCourses)) {
        rawCourses = [];
      }

      // Filter only valid courses with an id
      const validCourses = rawCourses.filter((c) => c && c.id != null);

      setCourses(validCourses);

      if (validCourses.length > 0) {
        setSelectedCourse(String(validCourses[0].id));
      } else {
        setSelectedCourse("");
      }
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Failed to load courses");
      setCourses([]);
      setSelectedCourse("");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (reportType) {
        case "course-performance":
          await generateCoursePerformanceReport();
          break;
        case "attendance":
          await generateAttendanceReport();
          break;
        case "grade-distribution":
          await generateGradeDistributionReport();
          break;
        case "student-progress":
          await generateStudentProgressReport();
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const generateCoursePerformanceReport = async () => {
    try {
      const performanceResponse = await facultyService.getClassPerformance(
        selectedCourse
      );

      const studentsResponse = await facultyService.getCourseStudents(
        selectedCourse
      );
      const students = studentsResponse.results || studentsResponse;

      const gradesResponse = await api.get("grades/", {
        params: { offering: selectedCourse, is_finalized: true },
      });
      const grades = gradesResponse.data.results || gradesResponse.data;

      const gradeDistribution = {};
      students.forEach((student) => {
        const studentGrades = grades.filter(
          (g) => g.student.student_id === student.student.student_id
        );
        if (studentGrades.length > 0) {
          const avgGrade = getLetterGrade(
            studentGrades.reduce((sum, g) => sum + (g.marks_obtained || 0), 0) /
              studentGrades.length
          );
          gradeDistribution[avgGrade] = (gradeDistribution[avgGrade] || 0) + 1;
        }
      });

      const gradeDistData = Object.entries(gradeDistribution).map(
        ([grade, count]) => ({
          name: grade,
          Students: count,
        })
      );

      const studentsWithGrades = students
        .map((student) => {
          const studentGrades = grades.filter(
            (g) => g.student.student_id === student.student.student_id
          );
          const avgScore =
            studentGrades.length > 0
              ? studentGrades.reduce(
                  (sum, g) => sum + (g.marks_obtained || 0),
                  0
                ) / studentGrades.length
              : 0;

          const attendance = student.student.attendance_percentage || 0;

          return {
            name: student.student.full_name || student.student.first_name,
            regNumber: student.student.university_reg_number,
            gpa: student.student.current_gpa || 0,
            attendance: Math.round(attendance),
            avgScore,
          };
        })
        .sort((a, b) => b.avgScore - a.avgScore);

      const topPerformers = studentsWithGrades
        .slice(0, 5)
        .map((s, i) => [
          i + 1,
          s.name,
          s.regNumber,
          s.gpa.toFixed(2),
          `${s.attendance}%`,
        ]);

      const scores = studentsWithGrades.map((s) => s.avgScore);
      const average =
        scores.length > 0
          ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
          : "0.00";
      const sortedScores = [...scores].sort((a, b) => a - b);
      const median =
        sortedScores.length > 0
          ? sortedScores[Math.floor(sortedScores.length / 2)].toFixed(2)
          : "0.00";
      const passRate =
        scores.length > 0
          ? (
              (scores.filter((s) => s >= 50).length / scores.length) *
              100
            ).toFixed(2)
          : "0.00";
      const variance =
        scores.length > 0
          ? scores.reduce(
              (acc, s) => acc + Math.pow(s - parseFloat(average), 2),
              0
            ) / scores.length
          : 0;
      const stdDev = Math.sqrt(variance).toFixed(2);

      setReportData({
        charts: [
          {
            type: "bar",
            title: "Grade Distribution",
            data: gradeDistData,
          },
        ],
        table: {
          title: "Top 5 Performers",
          columns: ["Rank", "Student", "Reg #", "GPA", "Attendance %"],
          rows: topPerformers,
        },
        stats: {
          Average: `${average}%`,
          Median: `${median}%`,
          "Pass Rate": `${passRate}%`,
          "Std Dev": stdDev,
          "Total Students": students.length,
        },
      });
    } catch (error) {
      console.error("Error generating course performance report:", error);
      throw error;
    }
  };

  const generateAttendanceReport = async () => {
    try {
      const attendanceResponse = await api.get("attendance/", {
        params: { offering: selectedCourse },
      });
      const attendanceRecords =
        attendanceResponse.data.results || attendanceResponse.data;

      const studentsResponse = await facultyService.getCourseStudents(
        selectedCourse
      );
      const students = studentsResponse.results || studentsResponse;

      const attendanceSummary = students.map((student) => {
        const studentRecords = attendanceRecords.filter(
          (r) => r.student.student_id === student.student.student_id
        );
        const present = studentRecords.filter(
          (r) => r.status === "present"
        ).length;
        const absent = studentRecords.filter(
          (r) => r.status === "absent"
        ).length;
        const late = studentRecords.filter((r) => r.status === "late").length;
        const total = studentRecords.length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

        return [
          student.student.full_name || student.student.first_name,
          student.student.university_reg_number,
          present,
          absent,
          late,
          `${percentage}%`,
        ];
      });

      const weeklyTrend = [];
      for (let i = 4; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - i * 7);

        const weekRecords = attendanceRecords.filter((r) => {
          const date = new Date(r.attendance_date);
          return date >= weekStart && date <= weekEnd;
        });

        const weekPresent = weekRecords.filter(
          (r) => r.status === "present"
        ).length;
        const weekPercentage =
          weekRecords.length > 0
            ? Math.round((weekPresent / weekRecords.length) * 100)
            : 0;

        weeklyTrend.push({
          name: `Week ${5 - i}`,
          Attendance: weekPercentage,
        });
      }

      setReportData({
        charts: [
          {
            type: "line",
            title: "Attendance Trend (Last 5 Weeks)",
            data: weeklyTrend,
          },
        ],
        table: {
          title: "Student Attendance Summary",
          columns: [
            "Student",
            "Reg #",
            "Present",
            "Absent",
            "Late",
            "Percentage",
          ],
          rows: attendanceSummary,
        },
      });
    } catch (error) {
      console.error("Error generating attendance report:", error);
      throw error;
    }
  };

  const generateGradeDistributionReport = async () => {
    try {
      const gradesResponse = await api.get("grades/", {
        params: { offering: selectedCourse, is_finalized: true },
      });
      const grades = gradesResponse.data.results || gradesResponse.data;

      const gradeDistribution = {};
      grades.forEach((grade) => {
        const percentage =
          grade.max_marks > 0
            ? (grade.marks_obtained / grade.max_marks) * 100
            : 0;
        const letterGrade = getLetterGrade(percentage);
        gradeDistribution[letterGrade] =
          (gradeDistribution[letterGrade] || 0) + 1;
      });

      const pieData = Object.entries(gradeDistribution).map(
        ([grade, count]) => ({
          name: grade,
          value: count,
        })
      );

      const assessmentAverages = {};
      grades.forEach((grade) => {
        const assessmentName = grade.assessment_name || "Unknown";
        if (!assessmentAverages[assessmentName]) {
          assessmentAverages[assessmentName] = { total: 0, count: 0 };
        }
        assessmentAverages[assessmentName].total += grade.marks_obtained || 0;
        assessmentAverages[assessmentName].count++;
      });

      const barData = Object.entries(assessmentAverages).map(
        ([name, data]) => ({
          name,
          Average: Math.round(data.total / data.count),
        })
      );

      const allScores = grades.map((g) =>
        g.max_marks > 0 ? (g.marks_obtained / g.max_marks) * 100 : 0
      );
      const average =
        allScores.length > 0
          ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)
          : "0.00";
      const sortedScores = [...allScores].sort((a, b) => a - b);
      const median =
        sortedScores.length > 0
          ? sortedScores[Math.floor(sortedScores.length / 2)].toFixed(2)
          : "0.00";
      const passRate =
        allScores.length > 0
          ? (
              (allScores.filter((s) => s >= 50).length / allScores.length) *
              100
            ).toFixed(2)
          : "0.00";
      const highest =
        allScores.length > 0 ? Math.max(...allScores).toFixed(2) : "0.00";
      const lowest =
        allScores.length > 0 ? Math.min(...allScores).toFixed(2) : "0.00";

      setReportData({
        charts: [
          {
            type: "pie",
            title: "Overall Grade Distribution",
            data: pieData,
          },
          {
            type: "bar",
            title: "Assessment-wise Average Marks",
            data: barData,
          },
        ],
        stats: {
          Average: `${average}%`,
          Median: `${median}%`,
          "Pass Rate": `${passRate}%`,
          Highest: `${highest}%`,
          Lowest: `${lowest}%`,
        },
      });
    } catch (error) {
      console.error("Error generating grade distribution report:", error);
      throw error;
    }
  };

  const generateStudentProgressReport = async () => {
    try {
      const studentsResponse = await facultyService.getCourseStudents(
        selectedCourse
      );
      const students = studentsResponse.results || studentsResponse;

      if (students.length === 0) {
        setReportData({
          charts: [],
          table: null,
          message: "No students enrolled in this course",
        });
        return;
      }

      const firstStudent = students[0].student;

      const gradesResponse = await api.get("grades/", {
        params: {
          student: firstStudent.student_id,
          offering: selectedCourse,
        },
      });
      const grades = gradesResponse.data.results || gradesResponse.data;

      const sortedGrades = grades.sort(
        (a, b) => new Date(a.graded_at) - new Date(b.graded_at)
      );

      const trendData = sortedGrades.map((grade) => ({
        name: grade.assessment_name || "Assessment",
        Score:
          grade.max_marks > 0
            ? Math.round((grade.marks_obtained / grade.max_marks) * 100)
            : 0,
      }));

      const tableData = sortedGrades.map((grade) => [
        grade.assessment_name || "Assessment",
        grade.marks_obtained || 0,
        grade.max_marks || 0,
        grade.max_marks > 0
          ? `${Math.round((grade.marks_obtained / grade.max_marks) * 100)}%`
          : "0%",
        `${grade.weightage_percentage || 0}%`,
      ]);

      setReportData({
        charts: [
          {
            type: "line",
            title: `Individual Performance Trend - ${
              firstStudent.full_name || firstStudent.first_name
            }`,
            data: trendData,
          },
        ],
        table: {
          title: "Assessment Breakdown",
          columns: ["Assessment", "Score", "Max", "Percentage", "Weightage"],
          rows: tableData,
        },
      });
    } catch (error) {
      console.error("Error generating student progress report:", error);
      throw error;
    }
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 85) return "A-";
    if (percentage >= 80) return "B+";
    if (percentage >= 75) return "B";
    if (percentage >= 70) return "B-";
    if (percentage >= 65) return "C+";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const handleExport = async (format) => {
    try {
      alert(`Exporting report as ${format.toUpperCase()}...`);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !reportData) {
    return (
      <div className="reports">
        <Skeleton variant="text" width="300px" height="40px" />
        <Skeleton
          variant="rectangular"
          height="600px"
          style={{ marginTop: "24px" }}
        />
      </div>
    );
  }

  return (
    <div className="reports">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="reports__header"
      >
        <h1>Reports</h1>
        <p>Generate and view comprehensive academic reports</p>
      </motion.div>

      <div className="reports__layout">
        <aside className="reports__sidebar">
          <Card className="reports__type-selector">
            <h3>Report Types</h3>
            <div
              className="reports__type-option"
              data-active={reportType === "course-performance"}
              onClick={() => setReportType("course-performance")}
            >
              Course Performance
            </div>
            <div
              className="reports__type-option"
              data-active={reportType === "attendance"}
              onClick={() => setReportType("attendance")}
            >
              Attendance Report
            </div>
            <div
              className="reports__type-option"
              data-active={reportType === "grade-distribution"}
              onClick={() => setReportType("grade-distribution")}
            >
              Grade Distribution
            </div>
            <div
              className="reports__type-option"
              data-active={reportType === "student-progress"}
              onClick={() => setReportType("student-progress")}
            >
              Student Progress
            </div>
          </Card>
        </aside>

        <section className="reports__content">
          <Card className="reports__filters-card">
            <div className="reports__filters">
              <Select
                label="Course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={courses.length === 0}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.course
                      ? `${c.course.course_code ?? "N/A"} - ${
                          c.course.course_name ?? "Unknown"
                        }`
                      : "Invalid Course Data"}
                  </option>
                ))}
                {courses.length === 0 && (
                  <option disabled>No courses available</option>
                )}
              </Select>
              <DatePicker
                label="From"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <DatePicker
                label="To"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="reports__export">
              <Button onClick={() => handleExport("pdf")} variant="secondary">
                Export PDF
              </Button>
              <Button onClick={() => handleExport("excel")} variant="secondary">
                Export Excel
              </Button>
              <Button onClick={handlePrint} variant="primary">
                Print
              </Button>
            </div>
          </Card>

          {/* No courses message */}
          {!loading && courses.length === 0 && !error && (
            <Card>
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <p>No visible courses found.</p>
              </div>
            </Card>
          )}

          {error && (
            <Card>
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <p style={{ color: "var(--error-500)" }}>{error}</p>
                <Button onClick={generateReport} style={{ marginTop: "1rem" }}>
                  Retry
                </Button>
              </div>
            </Card>
          )}

          {loading && selectedCourse ? (
            <Skeleton variant="rectangular" height="400px" />
          ) : reportData ? (
            <div className="reports__visualization">
              {reportData.message && (
                <Card>
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <p>{reportData.message}</p>
                  </div>
                </Card>
              )}

              {reportData.charts?.map((chart, idx) => (
                <Card key={idx} className="reports__chart-card">
                  <h3>{chart.title}</h3>
                  {chart.type === "line" && (
                    <LineChart data={chart.data} title={chart.title} />
                  )}
                  {chart.type === "bar" && (
                    <BarChart data={chart.data} title={chart.title} />
                  )}
                  {chart.type === "pie" && (
                    <PieChart data={chart.data} title={chart.title} />
                  )}
                </Card>
              ))}

              {reportData.stats && (
                <Card className="reports__stats">
                  <h3>Statistics</h3>
                  <div className="reports__stats-grid">
                    {Object.entries(reportData.stats).map(([key, value]) => (
                      <div key={key} className="reports__stat-item">
                        <span className="reports__stat-label">{key}</span>
                        <span className="reports__stat-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {reportData.table && (
                <Card className="reports__table-card">
                  <h3>{reportData.table.title}</h3>
                  <Table
                    columns={reportData.table.columns}
                    data={reportData.table.rows}
                  />
                </Card>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default Reports;
