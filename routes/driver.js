const express = require("express");
const router = express.Router();

const driversStore = require("../store/drivers");
// const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");
const Driver = require('../store/Driver')



//router.get("/:id", auth, (req, res) => {
router.get("/:id", async (req, res) => {
  const driverId = parseInt(req.params.id);
  
  const driverr = await Driver.find({ id: driverId})
  const driver = driverr[0]
  console.log (" driver hi", driver)

  if (!driver) return res.status(404).send();

  // const listings = listingsStore.filterListings(
  //   listing => listing.driverId === driverId
  // );

  res.send(driver);
  
});

module.exports = router;
