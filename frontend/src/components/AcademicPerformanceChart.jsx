import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { academicPerformance } from '../data/mockDashboard';
import { IconBarChart } from './Icons';

function AcademicPerformanceChart() {
  return (
    <div className="widget-card">
      <h3 className="widget-title">
        <IconBarChart /> Rendimiento Académico
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={academicPerformance} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" vertical={false} />
          <XAxis
            dataKey="grupo"
            tick={{ fontSize: 11, fill: '#6B7C74' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: '#6B7C74' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            cursor={{ fill: '#E8F5F0' }}
          />
          <Bar dataKey="promedio" fill="#2A9D6F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AcademicPerformanceChart;
