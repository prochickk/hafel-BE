const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const driversStore = require("../store/drivers");
const validateWith = require("../middleware/validation");
const config = require("config");

const Driver = require('../store/Driver');
const Idserial = require("../store/Idserial");
const defaultIdSerial = 500;

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().required().min(10),
  groupCateLabel: Joi.string().required(),
  password: Joi.string().required().min(5),
};

router.post("/",[
  upload.array("images", config.get("maxImageCount")),
  validateWith(schema)], async (req, res) => {
    const driverMobile = await Driver.find({ mobileNumber: req.body.mobileNumber})
    const driverEmail = await Driver.find({ email: req.body.email})

  if (driversStore.getDriverByEmail(req.body.email) || driverEmail[0] || driverMobile[0]) 
    return res
      .status(400)
      .send({ error: "A driver with the given email or Mobile Number already exists." });

  const driver = { 
    name: req.body.name,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    groupCate: req.body.groupCateLabel,
    password:  req.body.password};
    
    driversStore.addDriver(driver);

  try {
    let IdserialImport = await Idserial.findOne();
    if ( IdserialImport == null || !IdserialImport.idDriver) {
      await Idserial.create({ idDriver: defaultIdSerial})
      IdserialImport = await Idserial.findOne();}

    const IdserialDbUpdate = await Idserial.updateOne(
      { idDriver: IdserialImport.idDriver},
      { $inc: { idDriver: 1 }});

    const driverdb = await Driver.create({
      name: driver.name,
      email: driver.email,
      mobileNumber: driver.mobileNumber,
      group: driver.groupCate,
      password: driver.password,
      id: IdserialImport.idDriver + 1 ,
    })

  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }

  res.status(201).send(driver);
});


router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find()
    res.send(drivers)
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }
});

module.exports = router;

