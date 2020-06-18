const express = require('express');
const router = express.Router();
const report = require("../actors/report");

router.get('/', async (req, res) => {
  console.log("Recieved Request to Generate Report");
  try {
    
    res.status(200).json({message: report.getWeeklyReport()})
    
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
