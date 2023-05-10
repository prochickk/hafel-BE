const express = require("express");
const router = express.Router();

const User = require('../module/User');
const auth = require("../middleware/auth");


router.get("/", auth, async (req, res) => {
    try {
        let usersNotConf = await User.find({ groupConfirmation: false, group: req.query.driverGroup})
        if (!usersNotConf[0]){
            usersNotConf = [{
                name: "لا يوجد أي طلبات للتوثيق",
                group: '',
                email: "",
                mobileNumber: "0",
                groupConfirmation: null,
                id: 5
            }]}

        res.status(201).send(usersNotConf);

    } catch (error) {
        console.log(error.message)
    return res.status(404).send(error.message)
  }

});

router.post("/", auth, async (req, res) => {  
    const checkUserConfirm = await User.findOne({ id: parseInt(req.query.id) }) 
    if (!checkUserConfirm) return res.status(404).send("User is not found")
    try {
        let updateConfirm = await User.updateOne({ id: parseInt(req.query.id) }, { $set: { groupConfirmation: true }})
        res.status(201).send(updateConfirm)

    } catch (error) {
        console.log(error.message)
    return res.status(404).send(error.message)
  }
});

router.put("/", auth, async (req, res) => {
      const checkUserConfirm = await User.findOne({ id: req.query.id }) 
      if (!checkUserConfirm) return res.status(404).send("User is not found")
      try {
        
        const confirmDelete = await User.updateOne(
            { id: req.query.id}, { $unset: {groupConfirmation: ""} })
            res.status(201).send()

        } catch (error) {
          console.log(error.message)
          return res.status(404).send(error.message)
        }
    });

module.exports = router;

