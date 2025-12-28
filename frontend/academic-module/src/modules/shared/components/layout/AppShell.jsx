import React, { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import Header from "./Header";
import "./AppShell.css";

const AppShell = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div
      className={`app-shell ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      <main className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <div className="content-container animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
