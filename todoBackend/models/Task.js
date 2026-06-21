const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  priority: {
    type: String,
    default: "Medium"
  },
  status: {
    type: String,
    default: "pending"
  },
  duration: {
    type: Number,
    required: true
  },
  deadline: Date,
  createdAt: {
    type: Date,
    default: Date.now
  
}


});

module.exports = mongoose.model("Task", taskSchema);