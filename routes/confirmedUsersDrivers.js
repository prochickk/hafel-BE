const express = require("express");
const router = express.Router();

const Driver = require('../store/Driver');
const User = require('../store/User');


router.get("/", async (req, res) => {

    if (req.query.driverGroup) {
    try {
        let driversConfirmed = await Driver.find({groupConfirmation: true, group: req.query.driverGroup})
        if (!driversConfirmed[0]){
            driversConfirmed = [{
                name: "لا يوجد أي طلبات للتوثيق",
                group: '',
                email: "",
                mobileNumber: "0",
                groupConfirmation: null,
                id: 5
            }]}
        res.status(201).send(driversConfirmed);

    } catch (error) {
        console.log(error.message)
    return res.status(404).send(error.message)
  }}
    
  
  if (req.query.userGroup) {
    try {
        let usersConfirmed = await User.find({groupConfirmation: true, group: req.query.userGroup})
        if (!usersConfirmed[0]){
            usersConfirmed = [{
                name: "لا يوجد أي طلبات للتوثيق",
                group: '',
                email: "",
                mobileNumber: "0",
                groupConfirmation: null,
                id: 5
            }]}
        res.status(201).send(usersConfirmed);

    } catch (error) {
        console.log(error.message)
    return res.status(404).send(error.message)
  }}

});

module.exports = router;