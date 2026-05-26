import React from 'react';
import { ClipboardList, AlertCircle, CheckCircle2, Clock, Star } from 'lucide-react';

const StatsDashboard = ({ stats }) => {
  if (!stats) return null;

  const {
    totalTasks = 0,
    pendingTasks = 0,
    completedTasks = 0,
    averageImportance = 0,
    overdueTasks = 0,
    tasksByImportance = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
  } = stats;

  return (
    <div className="stats-dashboard">
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper blue">
            <ClipboardList size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Tasks</span>
            <h3 className="stat-value">{totalTasks}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper orange">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <h3 className="stat-value">{pendingTasks}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper green">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <h3 className="stat-value">{completedTasks}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel highlight-overdue">
          <div className="stat-icon-wrapper red">
            <AlertCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Overdue</span>
            <h3 className={`stat-value ${overdueTasks > 0 ? 'text-glow-red' : ''}`}>{overdueTasks}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper yellow">
            <Star size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Avg Importance</span>
            <h3 className="stat-value">{averageImportance.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="importance-breakdown glass-panel">
        <h4 className="breakdown-title">Tasks by Importance</h4>
        <div className="breakdown-bars">
          {Object.entries(tasksByImportance).map(([level, count]) => {
            const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
            return (
              <div key={level} className="breakdown-item">
                <div className="breakdown-label">
                  <span>Lvl {level}</span>
                  <span className="breakdown-count">{count}</span>
                </div>
                <div className="bar-outer">
                  <div 
                    className="bar-inner" 
                    style={{ 
                      width: `${percentage}%`,
                      background: `var(--importance-${level})`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
