const express = require("express");
const router = express.Router();

const Regions = require('../store/Regions');

router.get("/", async (req, res) => {
    try {
      console.log("req.query.driverGroup", req.query.driverGroup)
      if (req.query.driverGroup != "New"){
        let groupRegions = await Regions.find({group: req.query.driverGroup})
        res.send(groupRegions);
      }

      if (req.query.driverGroup == "New"){
        let groupRegions = await Regions.find({groupList: {$exists: true}}); 
        console.log("groupRegions", groupRegions)
        res.send(groupRegions);
      }
 
      } catch (error) {
        console.log(error.message)
        return res.status(404).send(error.message)
      }
  });


module.exports = router;