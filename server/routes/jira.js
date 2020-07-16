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

router.get('/DEDEL', async (req, res) => {
  console.log("Recieved Request to Generate Report");
  try {
    report.getDEDEL().then(response => {
      res.status(200).json({message: response})
    })
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/DEDELBP/:status', async (req, res) => {
  console.log("Recieved Request to DEDEL Pre-BP/BP Report");
  try {
    report.getDEDELBPReport(req.params.status).then(response => {
      res.status(200).json({message: response})
    })
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/DEDELDirect/:status', async (req, res) => {
  console.log("Recieved Request to DEDEL Direct Report");
  try {
    report.getDEDELDirectReport(req.params.status).then(response => {
      res.status(200).json({message: response})
    })
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/DEDELCapacity', async (req, res) => {
  console.log("Recieved Request to DEDEL Capacity Report");
  try {
    report.getDEDELCapacityAllocation().then(response => {
      res.status(200).json({message: response})
    })
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
