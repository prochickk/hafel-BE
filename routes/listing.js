const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Listing = require('../store/Listing')

router.get("/:id", auth, async (req, res) => {
  const listingArray = await Listing.find({ _id: req.params.id});
  const listing = listingArray;
  if (!listing) return res.status(404).send();
  res.send(listing);
});

module.exports = router;
