const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a board name'],
      trim: true,
      maxlength: [100, 'Board name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    columns: [
      {
        name: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          default: 0,
        },
        color: {
          type: String,
          default: '#E5E7EB',
        },
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

boardSchema.index({ project: 1 });

module.exports = mongoose.model('Board', boardSchema);
