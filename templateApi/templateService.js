/* 
    THIS NEEDS TO BE A SEPARATE API/SERVICE!!
*/
const jsonHelper = require("../api/helpers/jsonHelpers");
const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");

const app = express.Router();

const {
    TEMPLATE_MESSENGER_EVENT_QUEUE_NAME
} = require("./messager/queNames");

app.use(bodyParser.json({ type: "application/json" }));

app.get("/getTemplates", async(req)=>{
    try{
        
    }catch(err){
        const getJsonErrorData = (jsonHelper.tryParsingJson(err) ? jsonHelper.tryParsingJson(err) : err);

        if(getJsonErrorData){
            if(err.respCode){
                res.status(err.respCode).send(JSON.stringify(err));
            }else{
                res.status(500).send(JSON.stringify(err));
            }
        }else{
            res.status(500).send(JSON.stringify({
                success:false,
                errorMessage:err
            })); 
        }
    }
});

app.post("/saveTemplate", async(req)=>{
    try{
        
    }catch(err){
        const getJsonErrorData = (jsonHelper.tryParsingJson(err) ? jsonHelper.tryParsingJson(err) : err);

        if(getJsonErrorData){
            if(err.respCode){
                res.status(err.respCode).send(JSON.stringify(err));
            }else{
                res.status(500).send(JSON.stringify(err));
            }
        }else{
            res.status(500).send(JSON.stringify({
                success:false,
                errorMessage:err
            })); 
        }
    }
});

module.exports=app;