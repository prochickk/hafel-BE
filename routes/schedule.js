const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Schedule = require("../module/Schedule")

router.get("/:id", auth, async (req, res) => {
  const scheduleArray = await Schedule.find({ idSchedule: req.params.id});

  if (!scheduleArray[0]) return res.status(404).send();
  res.send(scheduleArray);
});

module.exports = router; 
