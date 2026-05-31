const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Message must have a sender name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Message must have a sender email'],
    lowercase: true,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Message must have a subject'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Message content cannot be empty'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
