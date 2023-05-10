const express = require("express");
const router = express.Router();

const usersStore = require("../module/users");
const auth = require("../middleware/auth");
const User = require('../module/User')



router.get("/:id", auth, async (req, res) => {
  const userId = parseInt(req.params.id);

  
  try {
    const user = await User.findOne({ id: userId});
    if (!user) return res.status(404).send('User does not exist')

    res.status(201).send(user);

  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }
});

module.exports = router;
