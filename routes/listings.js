const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const moment = require('moment');


const store = require("../module/listings");
const categoriesStore = require("../module/categories");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const config = require("config");
const Idserial = require('../module/Idserial')
const defaultIdSerial = 30000;

const Listing = require('../module/Listing');
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
  addressCateIdListing: Joi.number().required().min(1),
  addressRegionListing: Joi.string().required().min(1),
  useId: Joi.number().required(),
};

router.get("/", auth, async (req, res) => {
  let dateTo = moment().format("yyyy-MM-DDTHH:mm:ss.SSS");
  let dateFrom = moment().subtract(5,'d').format("yyyy-MM-DDTHH:mm:ss.SSS"); 
 
  const engToArbDay = (EngilshDay) => {
    if (EngilshDay == "Sunday") {return "الأحد"
    } else if (EngilshDay == "Monday") {return "الأثنين"
    } else if (EngilshDay == "Tuesday") {return "الثلاثاء"
    } else if (EngilshDay == "Wednesday") {return "الأربعاء"
    } else if (EngilshDay == "Thursday") {return "الخميس"
    } else {return "الأحد"}
  }
  
  let day = engToArbDay(moment().format('dddd'));
  let dayAfter = engToArbDay(moment().add(1,'d').format('dddd'));

  try {
   
    if (req.query.day != "currentDay") {
      day = req.query.day
      dayAfter = req.query.day
    }

    let listings = await Listing.find({ useId: req.query.userId, tripDayL: [day, dayAfter], creationDate: {$lt: dateTo}, creationDate: {$gt: dateFrom}});

    if (!listings[0]){
      listings = [{
        tripTypeL: "تتم اضافة الرحلات لهذا الأسبوع من الجدول الاسبوعي",
        tripTimeL: '',
        tripDayL: 'لا يوجد أي عنصر',
        addressL: 0,
        idListing: 0,
        // useId: 0,
        }]}

    res.status(200).send(listings);
    
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
}

});

router.delete("/", auth, async (req, res) => {
  const listingId = req.query.listingId
  
  listingDelete = await Listing.findOne({ idListing: listingId })
  if (!listingDelete) return res.status(404).send()


    try {
      const listingDelete = await Listing.deleteOne({ 
        idListing: listingId
      })

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
    const listing = {
      typeCateLabelL: req.body.typeCateLabelListing,
      timeCateLabelL: req.body.timeCateLabelListing,
      dayCateIdL: req.body.dayCateLabelListing,
      addressCateIdL: req.body.addressCateIdListing,
      descriptionL: req.body.descriptionListing,
      groupL: req.body.groupListing,
      useId: req.body.useId,
    };

    let tripDay = (arabicDay) => {
      if (arabicDay == "الأحد") {return "Sunday"
      } else if (arabicDay == "الأثنين") {return "Monday"
      } else if (arabicDay == "الثلاثاء") {return "Tuesday"
      } else if (arabicDay == "الأربعاء") {return "Wednesday"
      } else {return "Thursday"}
    }

    const convertToAddressObj = await Address.findOne({ idAddress: req.body.addressCateIdListing }) 

    try{
      let IdserialImport = await Idserial.findOne()

      if (!IdserialImport.idListing) {
        await Idserial.updateOne(IdserialImport, { idListing: defaultIdSerial})
        IdserialImport = await Idserial.findOne();}
      
      
      const IdserialDbUpdate = await Idserial.updateOne(
        { idListing: IdserialImport.idListing},
        { $inc: { idListing: 1 }});

    const listingdb = await Listing.create({
      tripTypeL: req.body.typeCateLabelListing,
      tripTimeL: req.body.timeCateLabelListing,
      tripDayL: req.body.dayCateLabelListing,
      tripDayEng: tripDay(req.body.dayCateLabelListing),
      addressL: convertToAddressObj.location,
      addressRegionL: req.body.addressRegionListing,
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
