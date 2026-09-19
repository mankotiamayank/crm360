import Task from '../models/task.js';

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
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
      // Only attach the dueDate if the user actually picked one
      ...(dueDate && { dueDate }),
      status: status || 'Pending',
      user: req.user._id 
    });
    
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    // 🚨 Now the terminal will ALWAYS tell us why it failed!
    console.error("CRITICAL ERROR in createTask:", error.message);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
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

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};