const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    timezone: {
      type: Number,
    },
    schedule: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('user', UserSchema);

module.exports = User;
