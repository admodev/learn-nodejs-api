const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');

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
router.post('/login', (req, res) => {});

module.exports = router;
