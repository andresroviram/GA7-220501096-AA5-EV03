import React from 'react';
import { topStudents } from '../data/mockDashboard';
import { IconBarChart } from './Icons';

function TopStudents() {
  return (
    <div className="widget-card">
      <h3 className="widget-title">
        <IconBarChart /> Top 5 Mejores Alumnos
      </h3>
      <ol className="top-students-list">
        {topStudents.map((student) => (
          <li key={student.id} className="top-students-item">
            <span className="top-students-rank">{student.id}</span>
            <div className="top-students-info">
              <p className="top-students-name">{student.name}</p>
              <p className="top-students-group">{student.group}</p>
            </div>
            <span className="top-students-score">{student.score.toFixed(1)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default TopStudents;
