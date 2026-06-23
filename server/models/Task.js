const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    dueDate: {
      type: Date,
    },
    labels: [
      {
        name: String,
        color: String,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    activityLog: [
      {
        action: {
          type: String,
          required: true,
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        details: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ board: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ column: 1 });
taskSchema.index({ assignees: 1 });

module.exports = mongoose.model('Task', taskSchema);
