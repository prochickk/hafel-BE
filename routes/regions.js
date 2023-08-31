const express = require("express");
const router = express.Router();

const Regions = require('../module/Regions');
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  console.log('hi')
  try {

    if (req.query.driverGroup != "New"){
      console.log('False')
      let groupRegions = await Regions.find({group: req.query.driverGroup})

      if (!groupRegions[0]) return res.status(404).send('Group is not found')

      res.status(200).send(groupRegions);
    }

    if (req.query.driverGroup == "New"){
      console.log('True')
      let groupRegions = await Regions.find({groupList: {$exists: true}}); 
      res.status(200).send(groupRegions);
    }

    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
  });


module.exports = router;