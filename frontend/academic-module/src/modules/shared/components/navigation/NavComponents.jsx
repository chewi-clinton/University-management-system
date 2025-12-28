import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="tabs-container flex border-b border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`tab-item px-6 py-3 relative font-medium transition-colors ${
            activeTab === tab.id
              ? "text-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export const Breadcrumbs = ({ paths }) => (
  <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
    {paths.map((path, index) => (
      <React.Fragment key={index}>
        <span
          className={
            index === paths.length - 1
              ? "text-gray-700 font-medium"
              : "hover:text-primary-500 cursor-pointer"
          }
        >
          {path}
        </span>
        {index < paths.length - 1 && <ChevronRight size={14} />}
      </React.Fragment>
    ))}
  </nav>
);
