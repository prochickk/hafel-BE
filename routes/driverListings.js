const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const moment = require('moment');

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const config = require("config");
const Idserial = require('../store/Idserial')
const defaultIdSerial = 30000;

const Listing = require('../store/Listing');
const User = require('../store/User');
const Address = require("../store/Address");

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

router.get("/", async (req, res) => {
  console.log("req.query.driverGroup", req.query.driverGroup)
  console.log("req.query", req.query.hourFilter)
  console.log("regionFilter", req.query.regionFilter)
  console.log("goBackFilter", req.query.goBackFilter)
  
  try {
    let filteredObject = {groupL: req.query.driverGroup}
        
    if (req.query.dayFilter !== "currentDay") {
      filteredObject["tripDayEng"] = req.query.dayFilter
      console.log("objectr", filteredObject)
    }
    if (req.query.hourFilter !== "allHours") {
      filteredObject["tripTimeL"] = req.query.hourFilter
      console.log("objectr", filteredObject)
    }
    if (req.query.regionFilter !== "allRegions") {
      filteredObject["addressRegionL"] = req.query.regionFilter
      console.log("objectr", filteredObject)
    }
    if (req.query.goBackFilter !== "allGoBack") {
      filteredObject["tripTypeL"] = req.query.goBackFilter
      console.log("objectr", filteredObject)
    }
    
    let listings = await Listing.find(filteredObject)
    console.log("before listings", listings)

    if (!listings[0]) {
      listings = [{
        tripTypeL: "تتم اضافة الرحلات لهذا الأسبوع من الجدول الاسبوعي",
        tripTimeL: '', tripDayL: 'لا يوجد أي عنصر', addressL: 0, idListing: 0,
      }]
    }
    
    res.send(listings);

  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }

});

router.delete("/", async (req, res) => {
  const listingId = req.query.listingId
  try {

    const listingDelete = await Listing.deleteOne({
      idListing: listingId
    })
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }
  // res.status(201).send(listing);
});

router.post(
  "/",
  [upload.array("images", config.get("maxImageCount")),
  validateWith(schema)], async (req, res) => {
    const listing = {
      typeCateLabelL: req.body.typeCateLabelListing,
      timeCateLabelL: req.body.timeCateLabelListing,
      dayCateIdL: req.body.dayCateLabelListing,
      addressCateIdL: req.body.addressCateIdListing,
      descriptionL: req.body.descriptionListing,
      groupL: req.body.groupListing,
      useId: req.body.useId,
    };

    try {
      let IdserialImport = await Idserial.findOne()

      if (!IdserialImport.idListing) {
        await Idserial.updateOne(IdserialImport, { idListing: defaultIdSerial })
        IdserialImport = await Idserial.findOne();
      }

      console.log("req.body.addressCateIdListing", req.body.addressCateIdListing)

      const IdserialDbUpdate = await Idserial.updateOne(
        { idListing: IdserialImport.idListing },
        { $inc: { idListing: 1 } });

      const listingdb = await Listing.create({
        tripTypeL: req.body.typeCateLabelListing,
        tripTimeL: req.body.timeCateLabelListing,
        tripDayL: req.body.dayCateLabelListing,
        addressL: req.body.addressCateIdListing,
        descriptionL: req.body.descriptionListing,
        groupL: req.body.groupListing,
        useId: req.body.useId,
        idListing: IdserialImport.idListing + 1,
      })

    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
    res.status(201).send(listing);
  }
);

module.exports = router;
