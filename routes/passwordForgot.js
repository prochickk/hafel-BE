const express = require("express");
const router = express.Router();

const User = require('../module/User')

router.get("/", async (req, res) => {

  const user = await User.findOne({ email: req.query.email});
  
  if (!user) return res.status(404).send('The given Email account was not found');
  res.status(200).send()
});

router.put("/", async (req, res) => {
    const checkUser = await User.findOne({ email: req.body.email }) 
    if (!checkUser) return res.status(404).send("User is not found")
    try {
      
      const updatePassword = await User.updateOne(
          { email: req.body.email }, { $set: { password: req.body.password }})
          res.status(201).send()

      } catch (error) {
        console.log(error.message)
        return res.status(404).send(error.message)
      }
  });

module.exports = router;
