
const express = require("express");
require("dotenv").config();
const ex_app = express();

const mainService = require("./api/emailerService");

ex_app.use("/", mainService);

ex_app.set("port", JSON.parse(process.env.CURRENT_PORT) || 4001);

ex_app.listen(ex_app.get("port"), ()=>{
    console.log("Listening on port " + process.env.CURRENT_PORT);
});