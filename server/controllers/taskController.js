import Task from '../models/task.js';

// Get all tasks (Role-aware: Admin & Sales Manager see all; Sales Executive sees own tasks)
export const getTasks = async (req, res) => {
  try {
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    const filter = isElevated ? {} : { user: req.user._id };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, dueDate, status } = req.body;
    
    const newTask = new Task({
      title,
      ...(dueDate && { dueDate }),
      status: status || 'Pending',
      user: req.user._id 
    });
    
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("CRITICAL ERROR in createTask:", error.message);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const isOwner = task.user?.toString() === req.user._id.toString();
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    if (!isOwner && !isElevated) {
      return res.status(403).json({ message: 'Not authorized to modify this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isOwner = task.user?.toString() === req.user._id.toString();
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    if (!isOwner && !isElevated) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};