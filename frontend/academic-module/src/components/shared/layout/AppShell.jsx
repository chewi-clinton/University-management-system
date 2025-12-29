import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import StudentSidebar from "./StudentSidebar.jsx";
import FacultySidebar from "./FacultySidebar.jsx";
import Header from "./Header.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const AppShell = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Render appropriate sidebar based on user role
  const renderSidebar = () => {
    if (user?.role === "faculty") {
      return <FacultySidebar isCollapsed={isSidebarCollapsed} />;
    }
    return <StudentSidebar isCollapsed={isSidebarCollapsed} />;
  };

  return (
    <>
      {renderSidebar()}

      <div
        className={`app__main ${
          isSidebarCollapsed ? "app__main--expanded" : ""
        }`}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          user={user}
        />

        <main className="app__content">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AppShell;
