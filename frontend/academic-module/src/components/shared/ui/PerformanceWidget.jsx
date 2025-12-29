import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import '../../../styles/components/PerformanceWidget.css';

const PerformanceWidget = ({ title, value, change, chartData, color = '#3b82f6' }) => {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      className="performance-widget"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="performance-widget__header">
        <h4 className="performance-widget__title">{title}</h4>
        <div className="performance-widget__value">
          <span>{value}</span>
          {change !== undefined && (
            <div className={`performance-widget__trend ${isPositive ? 'performance-widget__trend--up' : 'performance-widget__trend--down'}`}>
              <TrendIcon size={16} />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
      
      {chartData && chartData.length > 0 && (
        <div className="performance-widget__chart">
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default PerformanceWidget;