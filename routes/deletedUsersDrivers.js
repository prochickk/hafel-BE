const express = require("express");
const router = express.Router();

const Driver = require('../store/Driver');
const User = require('../store/User');


router.get("/", async (req, res) => {

    if (req.query.driverGroup) {
    try {
        let driversDeletedConf = await Driver.find({groupConfirmation: {$exists: false}, group: req.query.driverGroup})
        if (!driversDeletedConf[0]){
            driversDeletedConf = [{
                name: "لا يوجد أي طلبات للتوثيق",
                group: '',
                email: "",
                mobileNumber: "0",
                groupConfirmation: null,
                id: 5
            }]}
        res.status(201).send(driversDeletedConf);

    } catch (error) {
        console.log(error.message)
    return res.status(404).send(error.message)
  }}
    
  
  if (req.query.userGroup) {
    try {
        let usersDeletedConf = await User.find({groupConfirmation: {$exists: false}, group: req.query.userGroup})
        if (!usersDeletedConf[0]){
            usersDeletedConf = [{
                name: "لا يوجد أي طلبات للتوثيق",
                group: '',
                email: "",
                mobileNumber: "0",
                groupConfirmation: null,
                id: 5
            }]}
        res.status(201).send(usersDeletedConf);

    } catch (error) {
        console.log(error.message)
    return res.status(404).send(error.message)
  }}

});


module.exports = router;