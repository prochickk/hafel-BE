const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const driversStore = require("../module/drivers");
const validateWith = require("../middleware/validation");
const config = require("config");

const Driver = require('../module/Driver');
const Idserial = require("../module/Idserial");
const auth = require("../middleware/auth");
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

router.get("/", auth, async (req, res) => {
  try {
    const drivers = await Driver.find()
    res.status(201).send(drivers);
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }
});

router.post("/",[
  upload.array("images", config.get("maxImageCount")),
  validateWith(schema)], async (req, res) => {
    const driverMobile = await Driver.find({ mobileNumber: req.body.mobileNumber})
    const driverEmail = await Driver.find({ email: req.body.email})
  
  if (!req.body.mobileNumber || !req.body.email)
    return res.status(404).send('Invalid Email or Password send');

  if (driversStore.getDriverByEmail(req.body.email) || driverEmail[0] || driverMobile[0]) 
    return res.status(400).send("A driver with the given email or Mobile Number already exists.");

  try {
    let IdserialImport = await Idserial.findOne();
    if ( IdserialImport == null || !IdserialImport.idDriver) {
      await Idserial.create({ idDriver: defaultIdSerial})
      IdserialImport = await Idserial.findOne();}

    const IdserialDbUpdate = await Idserial.updateOne(
      { idDriver: IdserialImport.idDriver},
      { $inc: { idDriver: 1 }});

    const driverdb = new Driver({
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      group: req.body.groupCateLabel,
      password:  req.body.password,
      id: IdserialImport.idDriver + 1 ,
    })
    await driverdb.save();
    res.status(201).send(driverdb);

  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }

});

module.exports = router;

