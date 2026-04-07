import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { gradeDistribution } from '../data/mockDashboard';
import { IconPieChart } from './Icons';

const total = gradeDistribution.reduce((sum, g) => sum + g.value, 0);

function GradeDistributionChart() {
  return (
    <div className="widget-card">
      <h3 className="widget-title">
        <IconPieChart /> Distribución por Grado
      </h3>
      <div className="donut-wrapper">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={gradeDistribution}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {gradeDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [value, 'Estudiantes']}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total centrado sobre la dona */}
        <div className="donut-center-label">
          <span className="donut-total">{total}</span>
          <span className="donut-total-label">Total</span>
        </div>
      </div>

      {/* Leyenda manual */}
      <div className="donut-legend">
        {gradeDistribution.map((item) => (
          <div key={item.name} className="donut-legend-item">
            <span className="donut-legend-dot" style={{ background: item.color }} />
            <span className="donut-legend-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GradeDistributionChart;
