const express = require("express");
const router = express.Router();

const driversStore = require("../module/drivers");
const auth = require("../middleware/auth");
const Driver = require('../module/Driver')



router.get("/:id", auth, async (req, res) => {
  const driverId = parseInt(req.params.id);
  
  const driverr = await Driver.find({ id: driverId})
  const driver = driverr[0]

  if (!driver) return res.status(404).send();
  res.status(200).send(driver);
  
});

module.exports = router;
