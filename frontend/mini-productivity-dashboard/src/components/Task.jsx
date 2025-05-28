import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../store/Auth';  
import ConfirmModal from './ConfirmModal';
import './styles/Task.css'; 
import TabSwitcher from './TabSwitcher';
import { RxCrossCircled } from "react-icons/rx";

function Task() {
  const [tasks, setTasks] = useState([]);
  const [taskContent, setTaskContent] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('in progress');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { isLoggedin, user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskContentChange = (e) => setTaskContent(e.target.value);
  const handleTaskDateChange = (e) => setTaskDate(e.target.value);
  const handleTaskStatusChange = (e) => setTaskStatus(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedin) {
      window.location.href = '/login';
      return;
    }

    if (taskContent.trim() === '' || taskDate.trim() === '') {
      alert('Please fill both content and date');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      if (editMode && editId) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editId}`,
          {
            content: taskContent,
            date: taskDate,
            status: taskStatus,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTasks(
          tasks.map((task) =>
            task._id === editId
              ? { ...task, content: taskContent, date: taskDate, status: taskStatus }
              : task
          )
        );
        setEditMode(false);
        setEditId(null);
      } else {
        await axios.post(
          'http://localhost:5000/api/tasks',
          {
            content: taskContent,
            date: taskDate,
            status: taskStatus,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchTasks();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }

    setTaskContent('');
    setTaskDate('');
    setTaskStatus('in progress');
  };


  const requestDeleteTask = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== deleteId));
      setShowConfirmModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const cancelDeleteTask = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  const editTask = (task) => {
    setEditMode(true);
    setEditId(task._id);
    setTaskContent(task.content);
    setTaskDate(task.date);
    setTaskStatus(task.status || 'in progress');
  };

  const toggleStatus = async (task) => {
    const token = localStorage.getItem('token');
    const newStatus = task.status === 'completed' ? 'in progress' : 'completed';

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          content: task.content,
          date: task.date,
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(
        tasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

 
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.content.toLowerCase().includes(searchQuery) ||
      task.date.toLowerCase().includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && task.status === 'in progress') ||
      (statusFilter === 'completed' && task.status === 'completed') ||
      (statusFilter === 'overdue' && new Date(task.date) < new Date() && task.status !== 'completed');

    return matchesSearch && matchesStatus;
  });


  // const today = new Date().toISOString().slice(0, 10);

 const today = new Date().toLocaleDateString('en-CA');

 
  const completedTasks = tasks.filter((task) => task.status === 'completed');
  const pendingTasks = tasks.filter((task) => task.status === 'in progress');
  const overdueTasks = tasks.filter(
    (task) => new Date(task.date) < new Date(today) && task.status !== 'completed'
  );

 
  const todaysTasks = filteredTasks.filter((task) => task.date === today);
  const upcomingTasks = filteredTasks.filter((task) => task.date > today);
  const tasksForTodayCount = tasks.filter(task => task.date === today).length;

  const progress = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);



  return (
    <>
    
      <div className="task-container">
      <div className="task-section">
        <h2>Hello, <span className='username'>{user.username}</span></h2>
        <h3>Manage your tasks — organize your day with ease!</h3>

        <TabSwitcher/>

        <div className="info-boxes">
        <div className="info-box">Total Tasks: {tasks.length}</div>
        <div className="info-box">Today's Tasks: {tasksForTodayCount}</div>
        <div className="info-box">Completed Tasks: {completedTasks.length}</div>
        <div className="info-box">Pending Tasks: {pendingTasks.length}</div>
        </div>


        <div className="progress-container">
          <label htmlFor="task-progress">Progress</label>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className='progress-status'>{progress} % completed</p>
        </div>

        <form onSubmit={handleTaskSubmit} className="add-task-form">
        <div className="input-wrapper">
        <input
          type="text"
          placeholder="Enter new task"
          value={taskContent}
          onChange={handleTaskContentChange}
          className="add-task-input"
        />
        </div>
        <input
          type="date"
          value={taskDate}
          onChange={handleTaskDateChange}
          className="add-task-date"
        />
       
        <button type="submit" className="add-task-button">
          {editMode ? 'Update Task' : 'Add Task'}
        </button>
      </form>

        <div className="search-filter-container">
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M10 2a8 8 0 015.293 13.707l4 4-1.414 1.414-4-4A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
          </svg>
        </div>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          
        </select>
      </div>

              
        <div className="tasks-wrapper">
        <div className="tasks-column">
          <h3>Today's {todaysTasks.length === 1 ? 'Task' : 'Tasks'} ({todaysTasks.length})</h3>
          {todaysTasks.length === 0 && <p>No tasks for today.</p>}
          {todaysTasks.map((task , index) => (
            <div key={task._id} 
            className={`task-item ${task.status === 'completed' ? 'completed' : task.status === 'in progress' ? 'in-progress' : ''}`}>
              <div className="task-info">      
                <div className="task-title">
                <p className="task-content"> {index + 1}. {task.content}   <span className='task-creation'>.{new Date(task.createdAt).toLocaleDateString('en-CA')}</span></p>
                </div>
                <p className="task-date-status">
                  Due Date: {task.date}    
                </p>

                <p className='status'>
                  Status: <span className={`status-highlight ${task.status === 'completed' ? 'completed' : 'in-progress'}`}>              
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>

                </p>

              </div>
              <div className="task-buttons">
                <button
                  onClick={() => toggleStatus(task)}
                  title='Mark as complete or undo'
                 
                  className={`task-button toggle-status-button ${task.status === 'completed' ? 'undo' : 'done'}`}
                >
                  {task.status === 'completed' ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => editTask(task)}
                  title="Edit task"
                  className="task-button edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => requestDeleteTask(task._id)}
                  title="Delete task"
                  className="task-button delete-button"
                >
                  <RxCrossCircled size={25}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="tasks-column">
          <h3>Upcoming {upcomingTasks.length === 1 ? 'Task' : 'Tasks'} ({upcomingTasks.length})</h3>
          {upcomingTasks.length === 0 && <p>No upcoming tasks.</p>}
          {upcomingTasks.map((task, index) => (
            <div key={task._id} className="task-item">
              <div className="task-info">
               
                 <div className="task-title">
                <p className="task-content"> {index + 1}. {task.content}   <span className='task-creation'>.{new Date(task.createdAt).toLocaleDateString('en-CA')}</span></p>
                </div>
                <p className="task-date-status">
                  Due Date: {task.date} 
                </p>
                <p className='status'>
                 
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </p>
              </div>
              <div className="task-buttons">
                <button
                  onClick={() => toggleStatus(task)}
                  title='Mark as complete or undo'
                 
                  className={`task-button toggle-status-button ${task.status === 'completed' ? 'undo' : 'done'}`}
                >
                  {task.status === 'completed' ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => editTask(task)}
                  title="Edit task"
                  className="task-button edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => requestDeleteTask(task._id)}
                  title="Delete task"
                  className="task-button delete-button"
                >
                  <RxCrossCircled size={25}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
        
      
        <ConfirmModal
          show={showConfirmModal}
          message="Are you sure you want to delete this task?"
          onConfirm={confirmDeleteTask}
          onCancel={cancelDeleteTask}
        />
      </div>

    
    </>
  );
}

export default Task; 





















