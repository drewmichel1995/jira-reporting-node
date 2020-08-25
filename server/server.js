require("dotenv").config();
const process = require('process');
const cron = require("node-cron");

const express = require("express");
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));


app.use(express.json());

const report = require("./actors/report");
const jiraRouter = require("./routes/jira");
app.use("/jira", jiraRouter);

//Listen for shutdown signals from host
process.on('SIGINT', function onSigint() {
    app.shutdown();
  });
  
  process.on('SIGTERM', function onSigterm() {
    app.shutdown();
  });
  
  app.shutdown = function () {
    // clean up your resources and exit 
    process.exit();
  };

  //"0 10 * * 1"
  //30 15 * * *
  //"0 22 * * 1"
  cron.schedule("0 22 * * 1", function() {
    console.log("---------------------");
    console.log("Running Weekly Reporting Cron Job");
    report.getWeeklyReport().then(response => {
        console.log("Weekly Reporting Cron Job Finished");
        console.log("---------------------");
    })
    //report.getWeeklyReport();
  });

app.listen(3000, () => console.log("Success! Server Running at Port 3000."));
