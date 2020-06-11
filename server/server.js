require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));


app.use(express.json());

const jiraRouter = require("./routes/jira");
app.use("/jira", jiraRouter);

app.listen(3000, () => console.log(process.env.DATABASE_URL));
