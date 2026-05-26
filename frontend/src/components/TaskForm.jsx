import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { createTask } from '../utils/api';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importance: 3,
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Get tomorrow's date string for input min attribute
  const getMinDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const tempErrors = {};
    
    // Title Validation
    if (!formData.title.trim()) {
      tempErrors.title = 'Title is required';
    } else if (formData.title.length < 3 || formData.title.length > 100) {
      tempErrors.title = 'Title must be between 3 and 100 characters';
    }

    // Description Validation
    if (formData.description && formData.description.length > 500) {
      tempErrors.description = 'Description cannot exceed 500 characters';
    }

    // Importance Validation
    const importanceNum = parseInt(formData.importance, 10);
    if (isNaN(importanceNum) || importanceNum < 1 || importanceNum > 5) {
      tempErrors.importance = 'Importance must be between 1 and 5';
    }

    // Due Date Validation
    if (!formData.dueDate) {
      tempErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const now = new Date();
      // Set hours to 0 to compare days
      selectedDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      
      if (selectedDate <= now) {
        tempErrors.dueDate = 'Due date must be in the future';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'importance' ? parseInt(value, 10) : value,
    });
    
    // Clear validation error on type
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newTask = await createTask(formData);
      onTaskCreated(newTask);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        importance: 3,
        dueDate: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating task:', error);
      const backendError = error.response?.data?.error || 'Failed to create task. Please try again.';
      setSubmitError(backendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container glass-panel">
      <h3 className="form-title">
        <PlusCircle size={20} className="title-icon" />
        Create New Task
      </h3>
      
      {submitError && (
        <div className="error-banner">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Deploy backend service"
            className={errors.title ? 'input-error' : ''}
            disabled={isSubmitting}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="importance">Importance Level *</label>
            <select
              id="importance"
              name="importance"
              value={formData.importance}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="1">1 - Low</option>
              <option value="2">2 - Medium-Low</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - High</option>
              <option value="5">5 - Critical</option>
            </select>
            {errors.importance && <span className="field-error">{errors.importance}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date *</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={getMinDateString()}
              className={errors.dueDate ? 'input-error' : ''}
              disabled={isSubmitting}
            />
            {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide context or instructions for this task..."
            rows="3"
            className={errors.description ? 'input-error' : ''}
            disabled={isSubmitting}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="spinner animate-spin" size={18} />
              Adding Task...
            </>
          ) : (
            <>
              <PlusCircle size={18} />
              Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
