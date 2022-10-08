const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Schedule = require("../store/Schedule")

router.get("/:id", auth, async (req, res) => {
  const scheduleArray = await Schedule.find({ _id: req.params.id});
  const schedule = scheduleArray;
  if (!schedule) return res.status(404).send();
  res.send(schedule);
});

module.exports = router; 
