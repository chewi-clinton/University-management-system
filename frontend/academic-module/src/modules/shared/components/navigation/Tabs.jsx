import React, { useRef, useEffect, useState } from "react";
import "./Navigation.css";

export const Tabs = ({ tabs, activeTab, onChange }) => {
  const [lineStyle, setLineStyle] = useState({});
  const tabsRef = useRef([]);

  useEffect(() => {
    const activeIdx = tabs.findIndex((t) => t.id === activeTab);
    const el = tabsRef.current[activeIdx];
    if (el) {
      setLineStyle({
        width: el.offsetWidth,
        left: el.offsetLeft,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="tabs-container">
      <div className="tabs-list">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => (tabsRef.current[i] = el)}
            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <div className="tab-underline" style={lineStyle} />
      </div>
    </div>
  );
};
