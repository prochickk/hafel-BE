const express = require("express");
const router = express.Router();

const Regions = require('../store/Regions');

router.get("/", async (req, res) => {
    try {
        let groupRegions = await Regions.find({group: req.query.driverGroup})
        res.send(groupRegions);

      } catch (error) {
        console.log(error.message)
        return res.status(404).send(error.message)
      }
  });


module.exports = router;