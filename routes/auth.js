const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const validateWith = require("../middleware/validation");
const usersStore = require('../store/users')

const User = require('../store/User');

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

router.post("/", validateWith(schema), async(req, res) => {
  const { email, password } = req.body;

  // const user = usersStore.getUserByEmail(email);
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
  res.send(token);
});

module.exports = router;
