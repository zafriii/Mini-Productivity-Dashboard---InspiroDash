const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getAllTasks, 
  getTaskById, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');

const authMiddleware = require('../middlewares/auth-middleware');

// Routes that require authentication
router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getAllTasks);
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
