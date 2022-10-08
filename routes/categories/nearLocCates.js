const express = require("express");
const router = express.Router();
const categoriesStore = require("../../store/categories");


router.get("/", (req, res) => {
    const nearLocCates = categoriesStore.getNearLocCates();
    res.send(nearLocCates);
  });

module.exports = router;
