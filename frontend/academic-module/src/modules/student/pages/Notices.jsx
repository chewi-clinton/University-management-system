import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Pin,
  Clock,
  Info,
  AlertCircle,
  Megaphone,
  Check,
} from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { Badge } from "../../../shared/components/display/Badge";
import { Button } from "../../../shared/components/forms/Button";
import "./notices.css";

const MOCK_NOTICES = [
  {
    id: 1,
    title: "Final Exam Schedule Spring 2025 Updated",
    content:
      "The final examination schedule for all undergraduate courses has been updated. Please check the student portal for your specific slot and room assignment. Note that some afternoon sessions have been moved to the morning.",
    priority: "Urgent",
    date: "2h ago",
    category: "Academic",
    isPinned: true,
    isUnread: true,
  },
  {
    id: 2,
    title: "Extended Library Hours for Finals Week",
    content:
      "Starting next Monday, the Central Library will remain open 24/7 to support students during the final examination period. Remember to carry your student ID at all times.",
    priority: "Important",
    date: "1 day ago",
    category: "Facility",
    isPinned: false,
    isUnread: true,
  },
  {
    id: 3,
    title: "Campus Wi-Fi Maintenance Notice",
    content:
      "Routine maintenance will be performed on the campus network backbone this Sunday between 02:00 AM and 04:00 AM. Intermittent connectivity issues may occur.",
    priority: "Normal",
    date: "2 days ago",
    category: "IT Support",
    isPinned: false,
    isUnread: false,
  },
];

const Notices = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const filters = ["All", "Urgent", "Important", "Normal"];

  const filteredNotices = MOCK_NOTICES.filter(
    (n) => activeFilter === "All" || n.priority === activeFilter
  );

  return (
    <AppShell>
      <motion.div
        className="notices-page"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <header className="page-header mb-8">
          <div className="flex items-center gap-3">
            <Megaphone className="text-primary" size={28} />
            <h1>Notices & Announcements</h1>
          </div>
          <p>Stay updated with the latest campus news and academic alerts.</p>
        </header>

        {/* Filter Tabs */}
        <div className="notices-filters mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              {filter === "Urgent" && <span className="count-dot" />}
            </button>
          ))}
        </div>

        <div className="notices-feed">
          <AnimatePresence mode="popLayout">
            {filteredNotices.map((notice) => (
              <motion.div
                key={notice.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`notice-wrapper ${notice.isUnread ? "unread" : ""}`}
              >
                <Card
                  className={`notice-card ${
                    expandedId === notice.id ? "expanded" : ""
                  }`}
                  onClick={() =>
                    setExpandedId(expandedId === notice.id ? null : notice.id)
                  }
                >
                  <div className="notice-header">
                    <div className="notice-meta-left">
                      <div
                        className={`priority-indicator ${notice.priority.toLowerCase()}`}
                      >
                        {notice.priority === "Urgent" ? (
                          <AlertCircle size={18} />
                        ) : (
                          <Info size={18} />
                        )}
                      </div>
                      <div className="notice-title-area">
                        <div className="flex items-center gap-2">
                          {notice.isPinned && (
                            <Pin size={14} className="pinned-icon" />
                          )}
                          <h4 className="notice-title">{notice.title}</h4>
                        </div>
                        <div className="notice-subtext">
                          <span className="notice-date">
                            <Clock size={12} /> {notice.date}
                          </span>
                          <span className="dot-separator">•</span>
                          <span className="notice-author">
                            By Academic Registry
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="notice-meta-right">
                      <Badge variant={notice.priority.toLowerCase()}>
                        {notice.priority}
                      </Badge>
                      <motion.div
                        animate={{ rotate: expandedId === notice.id ? 180 : 0 }}
                      >
                        <ChevronDown size={20} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === notice.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="notice-body"
                      >
                        <div className="notice-content">{notice.content}</div>
                        <div className="notice-actions mt-4">
                          <Button variant="outline" size="sm">
                            <Check size={14} /> Mark as Read
                          </Button>
                          <Button variant="ghost" size="sm">
                            Download Attachment
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default Notices;
