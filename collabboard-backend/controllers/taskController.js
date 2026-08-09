let { tasks } = require('../models/taskModel');

// 1. Get all tasks
exports.getTasks = (req, res) => {
  res.json(tasks);
};

// 2. Create a new task
exports.createTask = (req, res) => {
  const { title, status, priority } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    status: status || 'To Do',
    priority: priority || 'Low'
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

// 3. Update task details or move status (To Do / Doing / Done)
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
};

// 4. Delete a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.json({ message: 'Task deleted successfully' });
};