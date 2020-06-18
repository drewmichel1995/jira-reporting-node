const express = require('express');
const router = express.Router();
const report = require("../actors/report");

router.get('/', async (req, res) => {
  console.log("Recieved Request to Generate Report");
  try {
    report.getWeeklyReport().then(response => {
      res.status(200).json({message: response})
    })
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
