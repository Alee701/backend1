const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['info', 'alert', 'reminder'], // Notification types
      default: 'info',
    },
  },
  { timestamps: true } // Add createdAt and updatedAt timestamps
);

// Mark notification as read
notificationSchema.methods.markAsRead = function () {
  this.read = true;
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
