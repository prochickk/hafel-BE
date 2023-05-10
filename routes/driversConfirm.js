const express = require("express");
const router = express.Router();

const Driver = require('../module/Driver');
const auth = require("../middleware/auth");


router.get("/", auth, async (req, res) => {

    try {
        let driversNotConf = await Driver.find({ groupConfirmation: false, group: req.query.driverGroup})
        if (!driversNotConf[0]){
            driversNotConf = [{
                name: "لا يوجد أي طلبات للتوثيق",
                group: '',
                email: "",
                mobileNumber: "0",
                groupConfirmation: null,
                id: 5
            }]}

        res.status(201).send(driversNotConf);

    } catch (error) {
        console.log(error.message)
    return res.status(404).send(error.message)
  }

});

router.post("/", auth, async (req, res) => {  

    let updateCheck = await Driver.findOne({ id: parseInt(req.query.id) })
    if (!updateCheck) return res.status(404).send('Error driver not found')

    try {
        let updateConfirm = await Driver.updateOne({ id: parseInt(req.query.id) }, { $set: { groupConfirmation: true }})
        updateCheck = await Driver.findOne({ id: parseInt(req.query.id) })
        res.status(201).send(updateCheck)

    } catch (error) {
        console.log(error.message)
    return res.status(404).send(error.message)
  }

});

router.put("/", auth, async (req, res) => {

    let updateCheck = await Driver.findOne({ id: parseInt(req.query.id) })
    if (!updateCheck) return res.status(404).send('Error driver not found')

      try {
        const confirmDelete = await Driver.updateOne(
            {id: req.query.id}, { $unset: {groupConfirmation: ""}})
        updateCheck = await Driver.findOne({ id: parseInt(req.query.id) })
        res.status(201).send(updateCheck)

        } catch (error) {
          console.log(error.message)
          return res.status(404).send(error.message)
        }
    });


module.exports = router;

