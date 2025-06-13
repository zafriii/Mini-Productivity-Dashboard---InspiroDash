
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    date: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['in progress', 'completed'], 
      default: 'in progress' 
    }
  },
  { timestamps: true } // <-- This is the options object
);

module.exports = mongoose.model('Task', taskSchema);
