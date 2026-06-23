const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
      },
    ],
    color: {
      type: String,
      default: '#3B82F6',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Project', projectSchema);
