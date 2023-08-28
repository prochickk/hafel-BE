const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const validateWith = require("../middleware/validation");
const usersStore = require('../module/users')

const User = require('../module/User');

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

router.post("/", validateWith(schema), async(req, res) => {
  const { email, password } = req.body;

  const userr = await User.find({ email: email })
  const user  = userr[0]

  if (!user || user.password !== password)
    return res.status(400).send({ error: "Invalid email or password." });

  const token = jwt.sign(
    { userId: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      group: user.group,
      mobileNumber: user.mobileNumber,
      createdAt : user.createdAt,
      groupConfirmation : user.groupConfirmation,
      groupAdmin : user.groupAdmin
       },
    "jwtPrivateKey"
  );
  res.status(200).send(token);
});

router.delete("/", validateWith(schema), async (req, res) => {
  const { email, password } = req.query
  try {

    const userDelete = await User.deleteOne({ email: email })
    res.status(201).send();

  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }
});

module.exports = router;
