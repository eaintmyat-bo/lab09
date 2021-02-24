//Importing libraries
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");

//Creating a schema
const schema = new mongoose.Schema({
  email: {
    type: String,
    // required: true, //must-put values
    unique: true, //emails must be unique
    lowercase: true, //will be able to convert to lower-case before authorization
    validate: (value) => {
      return validator.isEmail(value);
    },
  },
  password: { type: String, /*required: true,*/ minlength: 5 },
  roles: { type: [{ type: String }], default: ["user"] },
});

//Method for Authenticating user
const getJwtBody = ({ _id, email, roles }) => ({ _id, email, roles }); //function to get user obj
schema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this; // referring to the current object
  const token = jwt.sign(getJwtBody(user), process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXP,
  });
  return token;
};

//Static method just to find if user is available
schema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isMatched = password === user.password;
  if (!isMatched) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};

//must be after all the code
const User = mongoose.model("User", schema, "users");
module.exports = User;
