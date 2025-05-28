const Task = require('../models/taskModel');


const createTask = async (req, res) => {
  try {
    const { content, date, status = 'in progress' } = req.body;

    const task = new Task({
      content,
      date,
      status,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Get All Tasks of Logged-in User
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get a Single Task by ID (Only if it belongs to the logged-in user)
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};



const updateTask = async (req, res) => {
  try {
    const { content, date, status } = req.body;

    const updateData = { content, date };
    if (status) updateData.status = status;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Delete Task (Only if it belongs to the logged-in user)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
