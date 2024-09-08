
const express = require("express");
require("dotenv").config();
const ex_app = express();

const mainService = require("./api/emailerService");

ex_app.use("/", mainService);

ex_app.listen(process.env.CURRENT_PORT, ()=>{
    console.log("Listening on port " + process.env.CURRENT_PORT);
});