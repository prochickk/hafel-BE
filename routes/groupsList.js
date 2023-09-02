const express = require("express");
const router = express.Router();

const Regions = require('../module/Regions');
const University = require("../module/University");

router.get("/", async (req, res) => {

    try {

        console.log('universities')
        const universities = await University.find()
        console.log('universities', universities)
        
        res.status(200).send(universities);

    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
  });


module.exports = router;