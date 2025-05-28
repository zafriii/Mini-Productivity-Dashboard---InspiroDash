import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../store/Auth';  
import ConfirmModal from './ConfirmModal';
import './styles/Goal.css'; 
import TabSwitcher from './TabSwitcher';
import { RxCrossCircled } from "react-icons/rx";

function Goal() {
  const [goals, setGoals] = useState([]);
  const [goalContent, setGoalContent] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalStatus, setGoalStatus] = useState('in progress');
  const [priority, setPriority] = useState('low');
  const [frequency, setFrequency] = useState('weekly');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const { isLoggedin, user } = useAuth();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/goals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleGoalContentChange = (e) => setGoalContent(e.target.value);
  const handleGoalDateChange = (e) => setGoalDate(e.target.value);
  const handleGoalStatusChange = (e) => setGoalStatus(e.target.value);
  const handlePriorityChange = (e) => setPriority(e.target.value);
  const handleFrequencyChange = (e) => setFrequency(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handleFrequencyFilterChange = (filter) => setFrequencyFilter(filter);

  const handleGoalSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedin) {
      window.location.href = '/login';
      return;
    }

    if (goalContent.trim() === '' || goalDate.trim() === '') {
      alert('Please fill both content and date');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      if (editMode && editId) {
        await axios.put(
          `http://localhost:5000/api/goals/${editId}`,
          {
            content: goalContent,
            date: goalDate,
            status: goalStatus,
            priority: priority,
            frequency: frequency,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setGoals(
          goals.map((goal) =>
            goal._id === editId
              ? { ...goal, content: goalContent, date: goalDate, status: goalStatus, priority: priority, frequency: frequency }
              : goal
          )
        );
        setEditMode(false);
        setEditId(null);
      } else {
        await axios.post(
          'http://localhost:5000/api/goals',
          {
            content: goalContent,
            date: goalDate,
            status: goalStatus,
            priority: priority,
            frequency: frequency,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchGoals();
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }

    setGoalContent('');
    setGoalDate('');
    setGoalStatus('in progress');
    setPriority('low');
    setFrequency('weekly');
  };

  const requestDeleteGoal = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteGoal = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/goals/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter(goal => goal._id !== deleteId));
      setShowConfirmModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const cancelDeleteGoal = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  const editGoal = (goal) => {
    setEditMode(true);
    setEditId(goal._id);
    setGoalContent(goal.content);
    setGoalDate(goal.date);
    setGoalStatus(goal.status || 'in progress');
    setPriority(goal.priority || 'low');
    setFrequency(goal.frequency || 'weekly');
  };

  const toggleStatus = async (goal) => {
    const token = localStorage.getItem('token');
    const newStatus = goal.status === 'completed' ? 'in progress' : 'completed';

    try {
      await axios.put(
        `http://localhost:5000/api/goals/${goal._id}`,
        {
          content: goal.content,
          date: goal.date,
          status: newStatus,
          priority: goal.priority,
          frequency: goal.frequency,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGoals(
        goals.map((g) => (g._id === goal._id ? { ...g, status: newStatus } : g))
      );
    } catch (error) {
      console.error('Error toggling goal status:', error);
    }
  };

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.content.toLowerCase().includes(searchQuery) ||
      goal.date.toLowerCase().includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && goal.status === 'in progress') ||
      (statusFilter === 'completed' && goal.status === 'completed') ||
      (statusFilter === 'overdue' && new Date(goal.date) < new Date() && goal.status !== 'completed');

    const matchesFrequency =
      frequencyFilter === 'all' ||
      goal.frequency === frequencyFilter;

    return matchesSearch && matchesStatus && matchesFrequency;
  });

  const today = new Date().toLocaleDateString('en-CA');

  // Counts for info boxes
  const completedGoals = goals.filter((goal) => goal.status === 'completed');
  const pendingGoals = goals.filter((goal) => goal.status === 'in progress');
  const overdueGoals = goals.filter(
    (goal) => new Date(goal.date) < new Date(today) && goal.status !== 'completed'
  );

  const progress = goals.length === 0 ? 0 : Math.round((completedGoals.length / goals.length) * 100);

  return (
    <>
      <div className="goal-container">
        <div className="goal-section">
          <h2>Hello, <span className='username'>{user.username}</span></h2>
          <h3>Manage your goals — organize your life with ease!</h3>

          <TabSwitcher/>

          <div className="info-boxes">
            <div className="info-box">Total Goals: {goals.length}</div>
            <div className="info-box">Completed Goals: {completedGoals.length}</div>
            <div className="info-box">Pending Goals: {pendingGoals.length}</div>
          </div>

          <div className="progress-container">
            <label htmlFor="goal-progress">Progress</label>
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className='progress-status'>{progress} % completed</p>
          </div>

          <form onSubmit={handleGoalSubmit} className="add-goal-form">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter new goal"
                value={goalContent}
                onChange={handleGoalContentChange}
                className="add-goal-input"
              />
            </div>
            <input
              type="date"
              value={goalDate}
              onChange={handleGoalDateChange}
              className="add-goal-date"
            />
            <select
              value={priority}
              onChange={handlePriorityChange}
              className="priority-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={frequency}
              onChange={handleFrequencyChange}
              className="frequency-select"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button type="submit" className="add-task-button">
              {editMode ? 'Update Goal' : 'Add Goal'}
            </button>
          </form>

          <div className="search-filter-container">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search goals"
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

          <div className="frequency-filter-buttons">
            <button
              className={`frequency-filter-btn ${frequencyFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFrequencyFilterChange('all')}
            >
              All Goals
            </button>
            <button
              className={`frequency-filter-btn ${frequencyFilter === 'weekly' ? 'active' : ''}`}
              onClick={() => handleFrequencyFilterChange('weekly')}
            >
              Weekly
            </button>
            <button
              className={`frequency-filter-btn ${frequencyFilter === 'monthly' ? 'active' : ''}`}
              onClick={() => handleFrequencyFilterChange('monthly')}
            >
              Monthly
            </button>
          </div>

          <div className="goals-section">

          <div className="goal-wrapper">
            <div className="goals-list">
              <h3 className='my-goals'>My {filteredGoals.length === 1 ? 'Goal' : 'Goals'} ({filteredGoals.length})</h3>
              {filteredGoals.length === 0 && <p className='no-goal'>No goals found.</p>}
              {filteredGoals.map((goal, index) => (
                <div key={goal._id} 
                  className={`goal-item ${goal.status === 'completed' ? 'completed' : goal.status === 'in progress' ? 'in-progress' : ''}`}>
                  <div className="goal-info">      
                    <div className="goal-title">
                      <p className="goal-content"> {index + 1}. {goal.content}   <span className='goal-creation'>.{new Date(goal.createdAt).toLocaleDateString('en-CA')}</span></p>
                    </div>
                    <p className="goal-date-status">
                      Due Date: {goal.date}    
                    </p>
                    <p className='status'>
                      Status: <span className={`status-highlight ${goal.status === 'completed' ? 'completed' : 'in-progress'}`}>
                        {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </span>
                    </p>
                    <p className='priority'>
                      Priority: <span className={`priority-${goal.priority}`}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                      </span>
                    </p>
                    <p className='frequency'>
                      Frequency: <span className={`frequency-${goal.frequency}`}>
                        {goal.frequency}
                      </span>
                    </p>
                  </div>
                  <div className="goal-buttons">
                    <button
                      onClick={() => toggleStatus(goal)}
                      title='Mark as complete or undo'
                      className={`task-button toggle-status-button ${goal.status === 'completed' ? 'undo' : 'done'}`}
                    >
                      {goal.status === 'completed' ? 'Undo' : 'Done'}
                    </button>
                    <button
                      onClick={() => editGoal(goal)}
                      title="Edit goal"
                      className="task-button edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => requestDeleteGoal(goal._id)}
                      title="Delete goal"
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
        </div>
        <ConfirmModal
          show={showConfirmModal}
          message="Are you sure you want to delete this goal?"
          onConfirm={confirmDeleteGoal}
          onCancel={cancelDeleteGoal}
        />
      </div>
    </>
  );
}

export default Goal;