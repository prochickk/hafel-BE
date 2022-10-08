const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Address =require('../store/Address.js')

router.get("/:id", auth, async (req, res) => {
  const addressArray = await Address.find({ _id: req.params.id});
  const address = addressArray;
  if (!address) return res.status(404).send();
  res.send(address);
});

module.exports = router;
