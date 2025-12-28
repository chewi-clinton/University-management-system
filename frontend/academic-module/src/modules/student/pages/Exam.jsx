import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  QrCode,
} from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { Button } from "../../../shared/components/forms/Button";
import { Modal } from "../../../shared/components/feedback/Modal";
import { Badge } from "../../../shared/components/display/Badge";
import "./exams.css";

const MOCK_EXAMS = [
  {
    id: "ex-1",
    courseCode: "CS301",
    title: "Data Structures Midterm",
    date: "Jan 25, 2025",
    time: "09:00 - 12:00",
    room: "A-101",
    seat: "45",
    daysLeft: 3,
    status: "upcoming",
  },
  {
    id: "ex-2",
    courseCode: "MA202",
    title: "Calculus II Final",
    date: "Feb 02, 2025",
    time: "14:00 - 17:00",
    room: "B-204",
    seat: "12",
    daysLeft: 10,
    status: "upcoming",
  },
];

const Exams = () => {
  const [showAdmitCard, setShowAdmitCard] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const handleOpenAdmitCard = (exam) => {
    setSelectedExam(exam);
    setShowAdmitCard(true);
  };

  return (
    <AppShell>
      <motion.div
        className="exams-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <header className="page-header mb-8">
          <h1>Examination Schedule</h1>
          <p>View your upcoming assessments, venues, and admit cards.</p>
        </header>

        {/* Exam Timeline Visualization */}
        <section className="timeline-section mb-10">
          <h3>Exam Timeline</h3>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            <div className="timeline-markers">
              <div className="marker today">
                <div className="marker-dot"></div>
                <span>Today</span>
              </div>
              {MOCK_EXAMS.map((exam, index) => (
                <div
                  key={exam.id}
                  className="marker upcoming"
                  style={{ left: `${(index + 1) * 30}%` }}
                >
                  <motion.div
                    className="marker-dot pulse"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  ></motion.div>
                  <span className="marker-label">{exam.courseCode}</span>
                  <span className="marker-days">{exam.daysLeft}d</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exam Cards Grid */}
        <div className="exams-grid">
          {MOCK_EXAMS.map((exam) => (
            <motion.div
              key={exam.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Card className="exam-card">
                <div className="exam-card-header">
                  <div>
                    <Badge variant="primary">{exam.courseCode}</Badge>
                    <h3 className="mt-2">{exam.title}</h3>
                  </div>
                  <div className="countdown-timer">
                    <Clock size={14} />
                    <span>In {exam.daysLeft} days</span>
                  </div>
                </div>

                <div className="exam-details">
                  <div className="detail-item">
                    <Calendar size={18} />
                    <div>
                      <p className="detail-label">Date & Time</p>
                      <p className="detail-value">
                        {exam.date} | {exam.time}
                      </p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <MapPin size={18} />
                    <div>
                      <p className="detail-label">Venue & Seat</p>
                      <p className="detail-value">
                        Room {exam.room}, Seat {exam.seat}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="exam-actions">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleOpenAdmitCard(exam)}
                  >
                    <FileText size={16} /> Admit Card
                  </Button>
                  <Button variant="ghost" title="Add to iCal">
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Admit Card Modal */}
        <Modal
          isOpen={showAdmitCard}
          onClose={() => setShowAdmitCard(false)}
          title="Official Admit Card"
        >
          {selectedExam && (
            <div className="admit-card-preview">
              <div className="admit-header">
                <div className="uni-logo">U</div>
                <div className="student-info">
                  <p className="font-bold">John Doe</p>
                  <p className="text-xs">UNI-2024-0123</p>
                </div>
              </div>
              <div className="admit-body">
                <div className="admit-field">
                  <span>Course</span>
                  <p>{selectedExam.title}</p>
                </div>
                <div className="admit-row">
                  <div className="admit-field">
                    <span>Date</span>
                    <p>{selectedExam.date}</p>
                  </div>
                  <div className="admit-field">
                    <span>Seat No.</span>
                    <p>{selectedExam.seat}</p>
                  </div>
                </div>
                <motion.div
                  className="qr-container"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <QrCode size={80} strokeWidth={1.5} />
                  <p className="text-xs text-secondary mt-2">Scan at Entry</p>
                </motion.div>
              </div>
              <Button className="w-full mt-4">
                <Download size={16} /> Download PDF
              </Button>
            </div>
          )}
        </Modal>
      </motion.div>
    </AppShell>
  );
};

export default Exams;
