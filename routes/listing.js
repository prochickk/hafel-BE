const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Listing = require('../module/Listing')

router.get("/:id", auth, async (req, res) => {
  const listingArray = await Listing.find({ idListing: req.params.id});
  if (!listingArray) return res.status(404).send();
  res.send(listingArray);
});

module.exports = router;
