const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");

const categoriesStore = require("../module/categories");

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const config = require("config");

const Idserial = require('../module/Idserial');
const defaultIdSerial = 15000;
const Address = require('../module/Address');

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = {
  name: Joi.string().required(),
  useId: Joi.number().required(),
  nearLocCateLabel: Joi.string().required(),

  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
};

router.get("/", auth, async (req, res) => {
  try {
    let addresses = await Address.find({ useId: req.query.userId});
    if (!addresses[0]){
      addresses = [{
        _id:"632c6da1898285b13d83b76c",
        location: { longitude: 49.5814367942512, latitude: 25.35299879846039 },
        name: 'لم تـتم إضافة أي مـوقـع',
        region: '',
        useId:1,
        idAddress: 1,
        }]}

    res.status(200).send(addresses);

    
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
}
});

router.delete("/", auth, async (req, res) => {
  const addressId = req.query.addressId

  try {
    const addressDelete = await Address.deleteOne({ 
      idAddress: addressId});
  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }
  res.status(201).send();
  });

router.post(
  "/", auth, [upload.array("images", config.get("maxImageCount")),
    validateWith(schema)], async (req, res) => {
      
      
      try {
        let IdserialImport = await Idserial.findOne()
        if (!IdserialImport.idAddress) {
        await Idserial.updateOne(IdserialImport, { idAddress: defaultIdSerial})
        IdserialImport = await Idserial.findOne();}
  
        const IdserialDbUpdate = await Idserial.updateOne(
          { idAddress: IdserialImport.idAddress},
          { $inc: { idAddress: 1 }});
        

        let addressdb = await Address.create({
          name: req.body.name,
          useId: req.body.useId,
          region: req.body.nearLocCateLabel,
          location: JSON.parse(req.body.location),
          idAddress: IdserialImport.idAddress + 1
        })

        address = await Address.findOne({name: req.body.name, useId: req.body.useId})

    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
    res.status(201).send(address);
  }
);
module.exports = router;


