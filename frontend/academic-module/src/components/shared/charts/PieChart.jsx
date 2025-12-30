// src/components/shared/charts/PieChart.jsx
import React from "react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../../styles/components/PieChart.css";

const COLORS = [
  "var(--primary-500)",
  "var(--primary-600)",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

const PieChart = ({
  data,
  title,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
}) => {
  return (
    <div className="pie-chart">
      {title && <h3 className="pie-chart__title">{title}</h3>}
      <div className="pie-chart__container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
              labelStyle={{ color: "var(--text-primary)" }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
