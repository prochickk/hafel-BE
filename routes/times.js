const express = require("express");
const router = express.Router();

const Times = require('../module/Times');

router.get("/", async (req, res) => {
    try {
     
        let times = await Times.find({type: req.query.type})
        res.send(times);
 
      } catch (error) {
        console.log(error.message)
        return res.status(404).send(error.message)
      }
  });


module.exports = router;