import React, { useState } from 'react';
import { Star, Calendar, CheckCircle2, Trash2, ShieldAlert, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task, onMarkComplete, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { _id, title, description, importance, dueDate, status, priorityScore } = task;

  const isCompleted = status === 'completed';
  const isHighPriority = priorityScore >= 50;

  // Check if task is overdue
  const isOverdue = !isCompleted && new Date(dueDate) < new Date();

  // Format date to human-readable string
  const getHumanReadableDate = (dateString) => {
    const dDate = new Date(dateString);
    const now = new Date();
    
    // Reset hours to compare dates only
    dDate.setHours(0,0,0,0);
    const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = dDate.getTime() - dNow.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1) return `in ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const handleMarkComplete = async () => {
    if (isCompleted || isUpdating) return;
    setIsUpdating(true);
    try {
      await onMarkComplete(_id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleConfirmDelete = async () => {
    setIsUpdating(true);
    try {
      await onDelete(_id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div 
      className={`task-card glass-panel ${isCompleted ? 'completed' : ''} ${isHighPriority ? 'high-priority' : ''} ${isOverdue ? 'overdue' : ''}`}
    >
      {/* Priority Score Header Badge */}
      <div className="card-score-badge">
        <span className="score-label">Score</span>
        <span className="score-value">{priorityScore.toFixed(2)}</span>
      </div>

      <div className="task-card-content">
        <div className="task-header-row">
          <h4 className="task-title" title={title}>
            {title}
          </h4>
          
          {/* Overdue Badge */}
          {isOverdue && (
            <span className="badge overdue-badge">
              <AlertTriangle size={12} />
              Overdue
            </span>
          )}
          
          {/* High Priority Badge */}
          {isHighPriority && !isCompleted && (
            <span className="badge priority-badge">
              <ShieldAlert size={12} />
              High Priority
            </span>
          )}
          
          {/* Completed Badge */}
          {isCompleted && (
            <span className="badge completed-badge">
              <CheckCircle2 size={12} />
              Completed
            </span>
          )}
        </div>

        {description && (
          <p className="task-description">
            {description}
          </p>
        )}

        <div className="task-meta-row">
          {/* Importance Stars */}
          <div className="importance-stars" title={`Importance: ${importance}/5`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={14} 
                className={`star-icon ${star <= importance ? 'active' : ''}`}
                style={star <= importance ? { fill: `var(--importance-${importance})`, color: `var(--importance-${importance})` } : {}}
              />
            ))}
          </div>

          {/* Due Date */}
          <div className={`due-date-wrapper ${isOverdue ? 'text-danger' : ''}`}>
            <Calendar size={14} />
            <span>
              {isCompleted ? 'Completed' : `Due: ${getHumanReadableDate(dueDate)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="task-card-actions">
        {showConfirmDelete ? (
          <div className="delete-confirm-flow">
            <span className="confirm-prompt">Are you sure?</span>
            <button 
              onClick={handleConfirmDelete} 
              className="action-btn-danger-confirm"
              disabled={isUpdating}
            >
              Delete
            </button>
            <button 
              onClick={handleCancelDelete} 
              className="action-btn-secondary"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            {!isCompleted ? (
              <button
                type="button"
                onClick={handleMarkComplete}
                className="action-btn-complete"
                disabled={isUpdating}
              >
                <CheckCircle2 size={15} />
                Mark Complete
              </button>
            ) : (
              <div className="completed-placeholder" />
            )}

            <button
              type="button"
              onClick={handleDeleteClick}
              className="action-btn-delete"
              disabled={isUpdating}
              title="Delete Task"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
