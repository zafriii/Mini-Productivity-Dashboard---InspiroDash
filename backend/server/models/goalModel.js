// const mongoose = require('mongoose');

// const goalSchema = new mongoose.Schema(
//   {
//     content: { type: String, required: true },
//     date: { type: String, required: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     status: {
//       type: String,
//       enum: ['in progress', 'completed'],
//       default: 'in progress'
//     },
//     priority: {
//       type: String,
//       enum: ['low', 'medium', 'high'],
//       default: 'low'
//     }
//   },
//   { timestamps: true } 
// );

// module.exports = mongoose.model('Goal', goalSchema);






const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    date: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['in progress', 'completed'],
      default: 'in progress'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly'],
      required: true // or false, depending on whether you want it to be mandatory
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
