import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handleImportanceChange = (e) => {
    onFilterChange({ ...filters, minImportance: parseInt(e.target.value, 10) });
  };

  const resetFilters = () => {
    onFilterChange({ status: 'all', minImportance: 1 });
  };

  return (
    <div className="task-filters glass-panel">
      <div className="filter-header">
        <Filter size={18} />
        <h4>Filter Tasks</h4>
      </div>

      <div className="filter-body">
        <div className="filter-section">
          <label className="filter-label">Status</label>
          <div className="status-toggle-group">
            {['all', 'pending', 'completed'].map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                className={`status-btn ${filters.status === statusOption ? 'active' : ''}`}
                onClick={() => handleStatusChange(statusOption)}
              >
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="importance-filter-header">
            <label className="filter-label">Min Importance</label>
            <span className="importance-val">Level {filters.minImportance}+</span>
          </div>
          <div className="slider-wrapper">
            <SlidersHorizontal size={14} className="slider-icon" />
            <input
              type="range"
              min="1"
              max="5"
              value={filters.minImportance}
              onChange={handleImportanceChange}
              className="importance-slider"
            />
          </div>
          <div className="slider-labels">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      </div>

      {(filters.status !== 'all' || filters.minImportance > 1) && (
        <button 
          type="button" 
          onClick={resetFilters} 
          className="reset-filters-btn"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
