const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const router = express.Router();

// Helper to handle async operations in Express
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get aggregate task stats
// @route   GET /bfhl/tasks/stats
// @access  Public
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              pendingTasks: {
                $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
              },
              completedTasks: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
              },
              totalImportance: { $sum: "$importance" },
              overdueTasks: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", "pending"] },
                        { $lt: ["$dueDate", new Date()] }
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            }
          }
        ],
        importanceGroups: [
          {
            $group: {
              _id: "$importance",
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);

  const result = stats[0];
  const totals = result.totals[0] || {
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalImportance: 0,
    overdueTasks: 0
  };

  const totalTasks = totals.totalTasks;
  const pendingTasks = totals.pendingTasks;
  const completedTasks = totals.completedTasks;
  const overdueTasks = totals.overdueTasks;
  const averageImportance = totalTasks > 0 ? Number((totals.totalImportance / totalTasks).toFixed(2)) : 0;

  // Initialize all keys 1 to 5 to 0
  const tasksByImportance = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0
  };

  result.importanceGroups.forEach(group => {
    if (group._id && tasksByImportance.hasOwnProperty(group._id.toString())) {
      tasksByImportance[group._id.toString()] = group.count;
    }
  });

  res.status(200).json({
    totalTasks,
    pendingTasks,
    completedTasks,
    averageImportance,
    overdueTasks,
    tasksByImportance
  });
}));

// @desc    Get all tasks sorted by priorityScore DESC
// @route   GET /bfhl/tasks
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { status, minImportance } = req.query;
  const query = {};

  if (status) {
    if (status !== 'pending' && status !== 'completed') {
      return res.status(400).json({ error: 'Status filter must be pending or completed' });
    }
    query.status = status;
  }

  if (minImportance) {
    const importanceNum = parseInt(minImportance, 10);
    if (isNaN(importanceNum) || importanceNum < 1 || importanceNum > 5) {
      return res.status(400).json({ error: 'minImportance must be an integer between 1 and 5' });
    }
    query.importance = { $gte: importanceNum };
  }

  const tasks = await Task.find(query);
  
  // Sort by priorityScore in descending order in memory
  tasks.sort((a, b) => b.priorityScore - a.priorityScore);

  res.status(200).json(tasks);
}));

// @desc    Create a new task
// @route   POST /bfhl/tasks
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const { title, description, importance, dueDate, status } = req.body;

  // Perform basic existence validation so Mongoose doesn't fail on dates or numbers cast silently
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (importance === undefined) {
    return res.status(400).json({ error: 'Importance is required' });
  }
  if (!dueDate) {
    return res.status(400).json({ error: 'Due date is required' });
  }

  // Create task document
  const task = new Task({
    title,
    description,
    importance,
    dueDate,
    status
  });

  // Mongoose validation triggers here
  await task.save();

  res.status(201).json(task);
}));

// @desc    Update an existing task
// @route   PATCH /bfhl/tasks/:id
// @access  Public
router.patch('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Malformed or invalid ID format' });
  }

  // Prevent modifying read-only auto-generated fields
  if (req.body.createdAt) delete req.body.createdAt;
  if (req.body._id) delete req.body._id;

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Apply updates to the document fields manually to trigger validators correctly
  Object.keys(req.body).forEach(key => {
    task[key] = req.body[key];
  });

  await task.save();

  res.status(200).json(task);
}));

// @desc    Delete a task
// @route   DELETE /bfhl/tasks/:id
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Malformed or invalid ID format' });
  }

  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json({ message: 'Task deleted successfully' });
}));

module.exports = router;
