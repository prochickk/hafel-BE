const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const usersStore = require("../module/users");
const validateWith = require("../middleware/validation");
const config = require("config");

const User = require('../module/User');
const Idserial = require("../module/Idserial");
const auth = require("../middleware/auth");
const defaultIdSerial = 10;

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
    const users = await User.find()
    res.send(users)
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }
});

router.post("/",[
  upload.array("images", config.get("maxImageCount")),
  validateWith(schema)], async (req, res) => {
    const userMobile = await User.find({ mobileNumber: req.body.mobileNumber})
    const userEmail = await User.find({ email: req.body.email})

  if (!req.body.mobileNumber || !req.body.email)
  return res.status(404).send('Invalid Email or Password send');

  if (usersStore.getUserByEmail(req.body.email) || userEmail[0] || userMobile[0]) 
    return res
      .status(400)
      .send({ error: "تم استخدام هذا الإيميل او رقم الجوال من قبل مستخدم اخر" });

  try {
    let IdserialImport = await Idserial.findOne();
    if ( IdserialImport == null || !IdserialImport.idUser) {
      await Idserial.create({ idUser: defaultIdSerial})
      IdserialImport = await Idserial.findOne();}

    const IdserialDbUpdate = await Idserial.updateOne(
      { idUser: IdserialImport.idUser},
      { $inc: { idUser: 1 }});

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      group: req.body.groupCateLabel,
      password: req.body.password,
      id: IdserialImport.idUser + 1 ,
    })
    await user.save();
    res.status(201).send(user);

  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }

});




module.exports = router;

