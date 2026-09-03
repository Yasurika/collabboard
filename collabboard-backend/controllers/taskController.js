const Task = require('../models/taskModel');
const User = require('../models/User');

// Get all tasks relevant to the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }]
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const creator = await User.findById(req.user.id).select('name');
    const creatorName = (req.body.createdByName || creator?.name || '').trim();
    const assigneeName = (req.body.assignedToName || '').trim();
    const assigneeId = req.body.assignedToId || req.body.assignedTo;
    const assigneeUser = assigneeId ? await User.findById(assigneeId) : (assigneeName ? await User.findOne({ name: assigneeName }) : null);

    const taskPayload = {
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'To Do',
      priority: req.body.priority || 'Medium',
      createdBy: req.user.id,
      createdByName: creatorName || 'Unknown user',
      assignedTo: assigneeUser ? assigneeUser._id : req.user.id,
      assignedToName: assigneeUser ? assigneeUser.name : (assigneeName || creatorName || 'Unknown user'),
    };

    const newTask = new Task(taskPayload);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};

// Update task status / details
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isCreator = task.createdBy && task.createdBy.toString() === req.user.id;
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isCreator = task.createdBy && task.createdBy.toString() === req.user.id;
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};