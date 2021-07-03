const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
mongoose.promise = Promise;

// Define userSchema
const userSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    unique: true, 
    required: true 
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  otherUsers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      match: {
        type: Boolean,
        required: true
      }, 
    }
  ],
  chatRooms: [
    {
      socketRoomNameId: {
        type: String,
        ref: "Chat",
        required: true
      },
      socketRoomName: {
        type: String
      }
    }
  ]
});

// Define schema methods
userSchema.methods = {
  checkPassword: function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  },
  hashPassword: (plainTextPassword) => {
    return bcrypt.hashSync(plainTextPassword, 10);
  },
};

// Define hooks for pre-saving
userSchema.pre('save', function (next) {
  if (!this.password) {
    console.log('NO PASSWORD PROVIDED');
    next();
  } else {
    this.password = this.hashPassword(this.password);
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;