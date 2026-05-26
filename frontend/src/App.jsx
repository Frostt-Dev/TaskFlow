import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Inbox, ListTodo } from 'lucide-react';
import StatsDashboard from './components/StatsDashboard';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskCard from './components/TaskCard';
import { getTasks, getStats, updateTask, deleteTask } from './utils/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    minImportance: 1
  });

  const loadData = async (showSilently = false) => {
    if (!showSilently) setLoading(true);
    setError('');
    try {
      // Fetch both tasks and stats concurrently
      const [tasksData, statsData] = await Promise.all([
        getTasks(filters),
        getStats()
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || 'Could not load data from the server. Check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when filters change
  useEffect(() => {
    loadData();
  }, [filters]);

  const handleTaskCreated = () => {
    // Refresh tasks and stats to ensure everything matches server scoring and database aggregation
    loadData(true);
  };

  const handleMarkComplete = async (id) => {
    try {
      await updateTask(id, { status: 'completed' });
      await loadData(true); // Silent reload to avoid page flickering
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to mark task as completed.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      await loadData(true); // Silent reload
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to delete task.');
    }
  };

  return (
    <div className="app-container">
      {/* Background glowing decorations */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <header className="app-header">
        <div className="header-brand">
          <div className="logo-box">
            <ListTodo size={28} />
          </div>
          <div>
            <h1>TaskFlow</h1>
            <p className="subtitle">Smart Task Manager with Priority Scoring</p>
          </div>
        </div>

        <button 
          onClick={() => loadData(false)} 
          className="refresh-btn glass-panel"
          title="Refresh Board"
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Stats Dashboard Card */}
      {stats && <StatsDashboard stats={stats} />}

      {/* Global Error Banner */}
      {error && (
        <div className="error-banner glass-panel">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => loadData(false)} className="error-retry-btn">Retry</button>
        </div>
      )}

      {/* Main Board Layout */}
      <main className="board-layout">
        {/* Controls Column */}
        <aside className="controls-column">
          <TaskForm onTaskCreated={handleTaskCreated} />
          <TaskFilters filters={filters} onFilterChange={setFilters} />
        </aside>

        {/* Task List Column */}
        <section className="list-column">
          <div className="list-header glass-panel">
            <h2 className="list-title">
              <Sparkles size={18} className="list-title-icon" />
              Prioritized Taskboard
            </h2>
            <span className="task-count-indicator">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} shown
            </span>
          </div>

          {loading ? (
            <div className="loader-container glass-panel">
              <RefreshCw className="spinner animate-spin" size={32} />
              <p>Loading your prioritized tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state glass-panel">
              <Inbox size={48} className="empty-icon" />
              <h3>Your board is clear</h3>
              <p>No tasks match your active filters or your board is empty.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onMarkComplete={handleMarkComplete}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
