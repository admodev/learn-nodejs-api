const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  // Validate data before submiting the user
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // Checking if user is already in database
  const emailExists = await User.findOne({
    email: req.body.email,
  });

  if (emailExists) return res.status(400).send('¡Email already exists!');

  // Hash password before inserting into database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({
      user: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({
    email: req.body.email,
  });

  // Check if the user email doesn't exist to throw a new error.
  if (!user) return res.status(400).send('Email/Password is wrong.');

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) return res.status(400).send('Invalid password');

  // Create and assign web token
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);

  res.header('auth-token', token).send(token);
});

module.exports = router;
