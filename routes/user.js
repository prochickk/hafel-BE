const express = require("express");
const router = express.Router();

const usersStore = require("../store/users");
// const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");
const User = require('../store/User')



//router.get("/:id", auth, (req, res) => {
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  // const user = usersStore.getUserById(userId);

  
  try {
    const user = await User.findOne({ id: userId});

    
    res.status(201).send(user);

  } catch (error) {
    console.log(error.message)
    return res.status(404).send(error.message)
  }

  // const listings = listingsStore.filterListings(
  //   listing => listing.userId === userId
  // );

  
});

module.exports = router;
