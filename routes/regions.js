const express = require("express");
const router = express.Router();

const Regions = require('../store/Regions');

router.get("/", async (req, res) => {
    try {
        console.log("req.query.driverGroup", req.query.driverGroup)
        let groupRegions = await Regions.find({group: req.query.driverGroup})
        
        let x = [{
          id: 4,
          group: 'الـــبــــاشــــا',
          name: "cash",
          __v: 0,
          adminId: 498,
          adminNumber: 581302920
        },
        {
          id: 5,
          group: 'الـــبــــاشــــا',
          name: "frash",
          __v: 0,
          adminId: 499,
          adminNumber: 581302920
        },
        {
          id: 6,
          group: 'الـــبــــاشــــا',
          name: req.query.driverGroup,
          __v: 0,
          adminId: 495,
          adminNumber: 581302920
        },
        groupRegions[1]
      ]
        console.log("groupRegions", groupRegions)
        res.send(groupRegions);

      } catch (error) {
        console.log(error.message)
        return res.status(404).send(error.message)
      }
  });


module.exports = router;