const express = require('express');
const router = express.Router();

const { 
  createGoal, 
  getAllGoals, 
  getGoalById, 
  updateGoal, 
  deleteGoal 
} = require('../controllers/goalController');

const authMiddleware = require('../middlewares/auth-middleware');

// Routes for goals (authentication required)
router.post('/', authMiddleware, createGoal);
router.get('/', authMiddleware, getAllGoals);
router.get('/:id', authMiddleware, getGoalById);
router.put('/:id', authMiddleware, updateGoal);
router.delete('/:id', authMiddleware, deleteGoal);

module.exports = router;
