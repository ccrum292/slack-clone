const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.promise = Promise;

// Define userSchema
const chatSchema = new Schema({
  socketRoomName: { 
    type: String, 
    required: true 
  },
  users: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      name: {
        type: String
      }
    }
  ],
  messages: [
    {
      messageId: {
        type: Schema.Types.ObjectId,
        auto: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      name: {
        type: String
      },
      msg: {
        type: String,
        trim: true,
        minLength: 1
      },
      dateCreated: {
        type: Date,
        default: Date.now()
      },
      dateUpdated: {
        type: Date
      }
    }
  ]
});

const User = mongoose.model('Chat', chatSchema);

module.exports = User;