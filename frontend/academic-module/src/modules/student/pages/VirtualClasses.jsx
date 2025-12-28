import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  PlayCircle,
  Clock,
  Calendar,
  ExternalLink,
  Search,
  History,
  Monitor,
} from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { Button } from "../../../shared/components/forms/Button";
import { Badge } from "../../../shared/components/display/Badge";
import "./virtualClasses.css";

const MOCK_LIVE = {
  id: "live-1",
  course: "CS301",
  title: "Lecture 12: Graph Algorithms & BFS",
  instructor: "Dr. Jane Smith",
  startTime: new Date(Date.now() + 15 * 60000), // 15 mins from now
  platform: "Zoom",
};

const WEEKLY_SCHEDULE = [
  {
    id: 1,
    day: "Monday",
    time: "09:00 AM",
    course: "CS301",
    title: "Data Structures",
  },
  {
    id: 2,
    day: "Monday",
    time: "02:00 PM",
    course: "MA202",
    title: "Calculus II",
  },
  {
    id: 3,
    day: "Wednesday",
    time: "10:30 AM",
    course: "EN101",
    title: "English Comp",
  },
];

const RECORDINGS = [
  {
    id: "rec-1",
    title: "Lecture 11: Tree Traversals",
    date: "Jan 20",
    duration: "55:20",
    course: "CS301",
  },
  {
    id: "rec-2",
    title: "Lecture 10: Sorting Basics",
    date: "Jan 18",
    duration: "48:15",
    course: "CS301",
  },
  {
    id: "rec-3",
    title: "Differentiation Part 4",
    date: "Jan 17",
    duration: "1:02:00",
    course: "MA202",
  },
];

const VirtualClasses = () => {
  const [timeLeft, setTimeLeft] = useState("00:15:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = MOCK_LIVE.startTime - now;
      if (diff <= 0) {
        setTimeLeft("LIVE NOW");
        clearInterval(timer);
      } else {
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft(
          `00:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppShell>
      <motion.div
        className="virtual-classes-page"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="page-header mb-8">
          <h1>Virtual Learning</h1>
          <p>Join live sessions and access class recordings anytime.</p>
        </header>

        {/* Featured Live/Next Card */}
        <section className="next-class-section mb-10">
          <Card className="featured-live-card">
            <div className="live-content">
              <div className="live-info">
                <Badge variant="danger" className="live-badge">
                  <span className="live-dot"></span>{" "}
                  {timeLeft === "LIVE NOW" ? "LIVE" : "UPCOMING"}
                </Badge>
                <h2 className="mt-4">
                  {MOCK_LIVE.course}: {MOCK_LIVE.title}
                </h2>
                <p className="instructor-name">with {MOCK_LIVE.instructor}</p>
                <div className="time-meta">
                  <Clock size={18} />
                  <span>
                    Starting in:{" "}
                    <strong className="countdown-text">{timeLeft}</strong>
                  </span>
                </div>
              </div>
              <div className="live-actions">
                <Button size="lg" className="join-now-btn">
                  Join Session <ExternalLink size={20} className="ml-2" />
                </Button>
                <p className="text-xs opacity-70 mt-3">
                  Platform: {MOCK_LIVE.platform}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <div className="virtual-grid">
          {/* Weekly Schedule */}
          <div className="schedule-column">
            <div className="section-header">
              <Calendar size={20} />
              <h3>Weekly Live Schedule</h3>
            </div>
            <div className="schedule-list mt-4">
              {WEEKLY_SCHEDULE.map((item) => (
                <div key={item.id} className="schedule-row">
                  <div className="day-tag">{item.day.substring(0, 3)}</div>
                  <div className="session-main">
                    <span className="session-time">{item.time}</span>
                    <p className="session-title">
                      {item.course} - {item.title}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Remind
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recordings Library */}
          <div className="recordings-column">
            <div className="section-header">
              <History size={20} />
              <h3>Recent Recordings</h3>
            </div>

            <div className="recordings-grid mt-4">
              {RECORDINGS.map((rec) => (
                <Card key={rec.id} variant="flat" className="recording-card">
                  <div className="video-thumbnail">
                    <PlayCircle size={32} className="play-icon" />
                    <span className="duration-badge">{rec.duration}</span>
                  </div>
                  <div className="recording-details">
                    <Badge variant="secondary" className="mb-1">
                      {rec.course}
                    </Badge>
                    <h4>{rec.title}</h4>
                    <p className="text-xs text-secondary">{rec.date}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default VirtualClasses;
