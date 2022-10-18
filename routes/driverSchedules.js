const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");

const categoriesStore = require("../store/categories");

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const config = require("config");
const Schedule = require('../store/Schedule');
const Idserial = require("../store/Idserial");
const Address = require("../store/Address");
const defaultIdSerial = 100000;

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  typeCateLabel: Joi.string().required(),
  timeCateLabel: Joi.string().required(),
  dayCateLabel: Joi.string().required(),
  group: Joi.string().required(),
  addressCateId: Joi.number().required().min(1),
  useId: Joi.number().required(),
  };


router.get("/", async (req, res) => {
  try {
    let schedules = await Schedule.find({ group: req.query.driverGroup});

    if (!schedules[0]){
      schedules = [{
        tripType: 'قم بإضافة رحلة للجدول الأسبوعي',
        tripTime: '',
        tripDay: 'لا يوجد أي عنصر',
        idSchedule: 0,
        }]}

    res.send(schedules);
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
}
});

router.delete("/", async (req, res) => {
  const scheduleId = req.query.scheduleId
    try {
      
      const scheduleDelete = await Schedule.deleteOne({ 
        idSchedule: scheduleId})
      } catch (error) {
        console.log(error.message)
        return res.status(404).send(error.message)
      }
      
    
      // res.status(201).send(schedule);

  });

router.post(
  "/",
    [upload.array("images", config.get("maxImageCount")),
    validateWith(schema)], async (req, res) => {
    const schedule = {
      typeCateLabel: req.body.typeCateLabel,
      timeCateLabel: req.body.timeCateLabel,
      dayCateLabel: req.body.dayCateLabel,
      addressCateId: parseInt(req.body.addressCateId),
      group: req.body.group,
      useId: req.body.useId,
    };
    
    const convertToAddressObj = await Address.findOne({ idAddress: req.body.addressCateId })

    if (req.body.location) schedule.location = JSON.parse(req.body.location);
    if (req.user) schedule.useId = req.user.userId;

    try {
      let IdserialImport = await Idserial.findOne()
      if (!IdserialImport.idSchedule) {
        await Idserial.updateOne(IdserialImport, { idSchedule: defaultIdSerial})
        IdserialImport = await Idserial.findOne();}

      const IdserialDbUpdate = await Idserial.updateOne(
        { idSchedule: IdserialImport.idSchedule},
        { $inc: { idSchedule: 1 }});

      const scheduledb = await Schedule.create({
        tripType: req.body.typeCateLabel,
        tripTime: req.body.timeCateLabel,
        tripDay: req.body.dayCateLabel,
        address: convertToAddressObj.region,
        addressRegion: convertToAddressObj.location,
        group: req.body.group,
        useId: req.body.useId,
        idSchedule: IdserialImport.idSchedule + 1
      });
      
    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
    
    res.status(201).send(schedule);
  }
);

module.exports = router;
