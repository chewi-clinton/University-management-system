// src/components/shared/charts/LineChart.jsx
import React from "react";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "../layout/Card";
import "../../../styles/components/LineChart.css";

const LineChart = ({ data, title, height = 300 }) => {
  return (
    <div className="line-chart">
      {title && <h3 className="line-chart__title">{title}</h3>}
      <div className="line-chart__container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLine
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
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            {data.length > 0 &&
              Object.keys(data[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`var(--primary-${500 + index * 100})`}
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                ))}
          </RechartsLine>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
