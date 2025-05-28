// const Goal = require('../models/goalModel');

// // Create Goal
// const createGoal = async (req, res) => {
//   try {
//     const { content, date, status = 'in progress', priority = 'low' } = req.body;

//     const goal = new Goal({
//       content,
//       date,
//       status,
//       priority,
//       user: req.user._id,
//     });

//     await goal.save();
//     res.status(201).json({ message: 'Goal created successfully', goal });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Get All Goals of Logged-in User
// const getAllGoals = async (req, res) => {
//   try {
//     const goals = await Goal.find({ user: req.user._id });
//     res.status(200).json(goals);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Get a Single Goal by ID
// const getGoalById = async (req, res) => {
//   try {
//     const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

//     if (!goal) {
//       return res.status(404).json({ message: 'Goal not found or unauthorized' });
//     }

//     res.status(200).json(goal);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Update Goal
// const updateGoal = async (req, res) => {
//   try {
//     const { content, date, status, priority } = req.body;

//     const updateData = { content, date };
//     if (status) updateData.status = status;
//     if (priority) updateData.priority = priority;

//     const goal = await Goal.findOneAndUpdate(
//       { _id: req.params.id, user: req.user._id },
//       updateData,
//       { new: true }
//     );

//     if (!goal) {
//       return res.status(404).json({ message: 'Goal not found or unauthorized' });
//     }

//     res.status(200).json({ message: 'Goal updated successfully', goal });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// // Delete Goal
// const deleteGoal = async (req, res) => {
//   try {
//     const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

//     if (!goal) {
//       return res.status(404).json({ message: 'Goal not found or unauthorized' });
//     }

//     res.status(200).json({ message: 'Goal deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

// module.exports = {
//   createGoal,
//   getAllGoals,
//   getGoalById,
//   updateGoal,
//   deleteGoal,
// };













const Goal = require('../models/goalModel');

// Create Goal
const createGoal = async (req, res) => {
  try {
    const { content, date, status = 'in progress', priority = 'low', frequency } = req.body;

    if (!frequency) {
      return res.status(400).json({ message: 'Frequency is required (e.g., weekly or monthly)' });
    }

    const goal = new Goal({
      content,
      date,
      status,
      priority,
      frequency,
      user: req.user._id,
    });

    await goal.save();
    res.status(201).json({ message: 'Goal created successfully', goal });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get All Goals of Logged-in User
const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get a Single Goal by ID
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update Goal
const updateGoal = async (req, res) => {
  try {
    const { content, date, status, priority, frequency } = req.body;

    const updateData = {};
    if (content) updateData.content = content;
    if (date) updateData.date = date;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (frequency) updateData.frequency = frequency;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }

    res.status(200).json({ message: 'Goal updated successfully', goal });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete Goal
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
