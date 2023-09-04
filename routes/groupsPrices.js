const express = require("express");
const router = express.Router();

const Regions = require('../module/Regions');

router.get("/", async (req, res) => {

    try {

        console.log('universities')
        const filteredGroups = await Regions.find({
            name : req.query.region,
            section : req.query.section,
            university : req.query.university})

        const finalGroupsList = [...new Set(filteredGroups.map(obj => obj.group))];

        const groupsPrices = await Regions.find({groupList : finalGroupsList})
        console.log('groupsPrices', groupsPrices)
        res.send(groupsPrices);

    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
  });


module.exports = router;

