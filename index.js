
const express = require("express");
const cors = require("cors");

require("dotenv").config();
const ex_app = express();

const Data = require("./setupManager");

const data = Data.instance;;

const {
    setupMessageBroker
} = data.setupMainService();

setupMessageBroker();

const mainService = require("./api/emailerService");

ex_app.use(cors({
    origin:"*",
    allowedHeaders:"Content-Type",
    methods:"POST"
}));

ex_app.use("/", mainService);

ex_app.set("port", JSON.parse(process.env.CURRENT_PORT) || 4001);

ex_app.listen(ex_app.get("port"), ()=>{
    console.log("Listening on port " + process.env.CURRENT_PORT);
});
