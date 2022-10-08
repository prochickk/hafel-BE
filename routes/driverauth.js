const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const validateWith = require("../middleware/validation");
const driversStore = require('../store/drivers')

const Driver = require('../store/Driver');

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

router.post("/", validateWith(schema), async(req, res) => {
  const { email, password } = req.body;

  // const driver = driversStore.getdriverByEmail(email);
  const driverr = await Driver.find({ email: email })
  const driver  = driverr[0]

  if (!driver || driver.password !== password)
    return res.status(400).send({ error: "Invalid email or password." });

  const token = jwt.sign(
    { driverId: driver.id,
      name: driver.name,
      email: driver.email,
      password: driver.password,
      group: driver.group,
      mobileNumber: driver.mobileNumber,
      createdAt : driver.createdAt,
      groupConfirmation : driver.groupConfirmation,
      groupAdmin : driver.groupAdmin,
       },
    "jwtPrivateKey"
  );
  res.send(token);
});

module.exports = router;
