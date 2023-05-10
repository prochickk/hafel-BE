const express = require("express");
const router = express.Router();
const categoriesStore = require("../../module/categories");

router.get("/", (req, res) => {
    const dayCates = categoriesStore.getAddressCates();
    res.send(dayCates);
  });

module.exports = router;