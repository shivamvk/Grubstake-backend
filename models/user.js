const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: Number,
    unique: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  events: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
  ],
  account: {
    google: {
      secret: String,
    },
    facebook: {
      secret: String,
    },
    email: {
      secret: String,
    },
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
