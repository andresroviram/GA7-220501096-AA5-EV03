import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { groupAverages } from '../data/mockDashboard';
import { IconBarChart } from './Icons';

const PRIMARY = '#2A9D6F';

function GroupAverageChart() {
  return (
    <div className="widget-card">
      <h3 className="widget-title">
        <IconBarChart /> Promedio por Grupo
      </h3>
      <div className="group-avg-list">
        {groupAverages.map((item) => (
          <div key={item.grupo} className="group-avg-row">
            <span className="group-avg-label">{item.grupo}</span>
            <div className="group-avg-bar-track">
              <div
                className="group-avg-bar-fill"
                style={{ width: `${(item.promedio / 10) * 100}%` }}
              />
            </div>
            <span className="group-avg-value">{item.promedio.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupAverageChart;
