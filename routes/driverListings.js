const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const moment = require('moment');
const SimpleDateFormat = require('@riversun/simple-date-format');

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const config = require("config");
const Idserial = require('../module/Idserial')
const defaultIdSerial = 30000;

const Listing = require('../module/Listing');
const User = require('../module/User');
const Address = require("../module/Address");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  descriptionListing: Joi.string().allow(""),
  typeCateLabelListing: Joi.string().required(),
  timeCateLabelListing: Joi.string().required(),
  groupListing: Joi.string().required(),
  dayCateLabelListing: Joi.string().required(),
  addressCateIdListing: Joi.string().required().min(1),
  useId: Joi.number().required(),
};

router.get("/", auth, async (req, res) => {

  let dateTo = moment().format("yyyy-MM-DDTHH:mm:ss.SSS");
  let dateFrom = moment().subtract(5,'d').format("yyyy-MM-DDTHH:mm:ss.SSS");
  let day = moment().format('dddd');
  try {
    let filteredObject = {groupL: req.query.driverGroup, creationDate: {$lt: dateTo}, creationDate: {$gt: dateFrom} }
        
    if (req.query.dayFilter !== "currentDay") {
      filteredObject["tripDayEng"] = req.query.dayFilter 
    }
    if (req.query.dayFilter == "currentDay") {
      if (day == "Friday" || day == "Saturday"){
        day = "Sunday"
      }
      filteredObject["tripDayEng"] = day 
    }
    if (req.query.hourFilter !== "allHours") {
      filteredObject["tripTimeL"] = req.query.hourFilter
    }
    if (req.query.regionFilter !== "allRegions") {
      filteredObject["addressRegionL"] = req.query.regionFilter
    }
    if (req.query.goBackFilter !== "allGoBack") {
      filteredObject["tripTypeL"] = req.query.goBackFilter
    }
    
    let listings = await Listing.find(filteredObject);

    if (!listings[0]) {
      listings = [{
        tripTypeL: "تتم اضافة الرحلات لهذا الأسبوع من الجدول الاسبوعي",
        tripTimeL: '', tripDayL: 'لا يوجد أي عنصر', addressL: 0, idListing: 0,
      }]
    }
    res.status(200).send(listings);

  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }

});

router.delete("/", auth, async (req, res) => {
  const listingId = req.query.listingId
  try {

    const listingDelete = await Listing.deleteOne({
      idListing: listingId
    })
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }
  res.status(201).send();
});

router.post(
  "/", auth,
  [upload.array("images", config.get("maxImageCount")),
  validateWith(schema)], async (req, res) => {

    if (!req.body || !req.body.groupListing) return res.status(404).send('the given form is not correct');
    
    try {
      let IdserialImport = await Idserial.findOne()

      if (!IdserialImport.idListing) {
        await Idserial.updateOne(IdserialImport, { idListing: defaultIdSerial })
        IdserialImport = await Idserial.findOne();
      }
      const IdserialDbUpdate = await Idserial.updateOne(
        { idListing: IdserialImport.idListing },
        { $inc: { idListing: 1 } });
        

      const listingdb = new Listing({
        tripTypeL: req.body.typeCateLabelListing,
        tripTimeL: req.body.timeCateLabelListing,
        tripDayL: req.body.dayCateLabelListing,
        addressL: req.body.addressCateIdListing,
        descriptionL: req.body.descriptionListing,
        groupL: req.body.groupListing,
        useId: req.body.useId,
        idListing: IdserialImport.idListing + 1,
      })

      await listingdb.save();
      res.status(201).send(listingdb);
      

    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
  }
);

module.exports = router;
