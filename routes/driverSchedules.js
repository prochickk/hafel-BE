const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");

const categoriesStore = require("../module/categories");

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const config = require("config");
const Schedule = require('../module/Schedule');
const Idserial = require("../module/Idserial");
const Address = require("../module/Address");
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


router.get("/", auth, async (req, res) => {
  try {
    let schedules = await Schedule.find({ group: req.query.driverGroup});

    if (!schedules[0]){
      schedules = [{
        tripType: 'قم بإضافة رحلة للجدول الأسبوعي',
        tripTime: '',
        tripDay: 'لا يوجد أي عنصر',
        idSchedule: 0,
        }]}

    res.status(200).send(schedules);
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
}
});

router.delete("/", auth, async (req, res) => {
  const scheduleId = req.query.scheduleId
  const scheduleChecks = await Schedule.findOne({ idSchedule: scheduleId })

  if (!scheduleChecks)
    return res.status(404).send("Item is not found in the Database")
  
  try {
    const scheduleDelete = await Schedule.deleteOne({ 
      idSchedule: scheduleId})
      res.status(201).send();

    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
  });

router.post(
  "/", auth, 
    [upload.array("images", config.get("maxImageCount")),
    validateWith(schema)], async (req, res) => {
        
    const convertToAddressObj = await Address.findOne({ idAddress: req.body.addressCateId })

    try {
      let IdserialImport = await Idserial.findOne()
      if (!IdserialImport.idSchedule) {
        await Idserial.updateOne(IdserialImport, { idSchedule: defaultIdSerial})
        IdserialImport = await Idserial.findOne();}

      const IdserialDbUpdate = await Idserial.updateOne(
        { idSchedule: IdserialImport.idSchedule},
        { $inc: { idSchedule: 1 }});


      const scheduledb = new Schedule({
        tripType: req.body.typeCateLabel,
        tripTime: req.body.timeCateLabel,
        tripDay: req.body.dayCateLabel,
        address: parseInt(req.body.addressCateId),
        addressRegion: convertToAddressObj.region,
        group: req.body.group,
        useId: req.body.useId,
        idSchedule: IdserialImport.idSchedule + 1
      });

      await scheduledb.save()

      const scheduledbb = await Schedule.findOne({addressRegion: convertToAddressObj.region})

      res.status(201).send(scheduledb);
      
    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
    
  }
);

module.exports = router;
