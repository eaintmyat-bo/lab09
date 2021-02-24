const express = require("express");
const User = require("../models/user.model");
const router = express.Router();

const auth = require("../middleware/auth");

//User registration
router.post("/users", async (req, res) => {
  // Create a new user
  console.log("Request body: ", req.body);
  try {
    const user = new User(req.body);
    await user.save(); //for async waiting
    console.log("Saved user: ", JSON.stringify(user));
    // const token = await user.generateAuthToken();
    res.status(201).send({ email: user.email, token });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: err.message });
  }
});

//User login
router.post("/users/login", async (req, res) => {
  //Login a registered user
  let { email, password } = req.body;
  res.json({ email, password });

  try {
    let { email, password } = req.body;
    let user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send({ error: "Login failed!" });
    }
    const token = await user.generateAuthToken();
    res.send({ email, token });
  } catch (err) {
    console.log(err.stack);
    res.status(400).send({ error: err.message });
  }
});

router.get("/users/profile", auth, (req, res) => {
  res.send(`Profile: ${JSON.stringify(req.user)} `);
});

module.exports = router;
