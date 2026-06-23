const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'host', 'admin'],
      default: 'user',
    },
    projects: [
      {
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Project',
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member'],
          default: 'member',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
