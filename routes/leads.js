const express = require("express");
const router = express.Router();
const Lead = require('../models/Lead')


router.post("/", async (req, res) => {
  try {
    const leads = await Lead.insertMany(req.body);

    console.log(leads);

    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("servererr");
  }
});

module.exports = router;
