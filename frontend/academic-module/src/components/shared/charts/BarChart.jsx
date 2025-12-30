// src/components/shared/charts/BarChart.jsx
import React from "react";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../../styles/components/BarChart.css";

const BarChart = ({ data, title, height = 300 }) => {
  return (
    <div className="bar-chart">
      {title && <h3 className="bar-chart__title">{title}</h3>}
      <div className="bar-chart__container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBar
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--text-secondary)" }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)" }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
              labelStyle={{ color: "var(--text-primary)" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
            {data.length > 0 &&
              Object.keys(data[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`var(--primary-${500 + index * 100})`}
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                ))}
          </RechartsBar>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
