import { useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";
import "../../../styles/admin-pages/admin-styles.css";

// Create a motion-enabled aside
const MotionAside = motion("aside");

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div
      className={`admin-layout ${
        sidebarCollapsed ? "admin-layout--collapsed" : ""
      } ${isDarkMode ? "admin-layout--dark" : ""}`}
    >
      {/* Sidebar */}
      <MotionAside
        className="admin-layout__sidebar"
        initial={false}
        animate={{
          width: sidebarCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AdminSidebar collapsed={sidebarCollapsed} />
      </MotionAside>

      {/* Main Content */}
      <div className="admin-layout__main">
        <AdminHeader
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          onToggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          onLogout={handleLogout}
        />

        <motion.main
          className="admin-layout__content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
