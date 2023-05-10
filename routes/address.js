const express = require("express");
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router();

const auth = require("../middleware/auth");
const Address =require('../module/Address.js')

router.get("/:id", auth, validateObjectId, async (req,
   res) => {
  const addressArray = await Address.find({ _id: req.params.id});
  const address = addressArray;
  if (!address) return res.status(404).send('the Address with the given ID was not found');
  res.send(address);
});

module.exports = router;
