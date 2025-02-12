/* 
    THIS NEEDS TO BE A SEPARATE API/SERVICE!!
*/
const jsonHelper = require("../helpers/jsonHelpers");
const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");

const app = express.Router();

const Data = require("../setupManager");
const data = Data.instance;

const {
    addToChannelQueue
} = require("../messager/send");

const {
    TEMPLATE_CREATOR_EVENT_QUEUE_NAME,
    TEMPLATE_UPDATER_EVENT_QUEUE_NAME,
    TEMPLATE_DELETER_EVENT_QUEUE_NAME,
    TEMPLATE_GETTER_EVENT_QUEUE_NAME
} = require("../messager/queNames");

const {
    cache
} = require("../setup");

const {
    setupMessageBroker,
} = data.setupMainService();

const {
    setupErrorMessageBroker,
} = data.setupErrorService();

setupErrorMessageBroker();
setupMessageBroker();

app.use(bodyParser.json({ type: "application/json" }));

app.get("/getTemplates", async(req)=>{
    try{
        const channelData = cache.get("messageBrokerConfig");

        addToChannelQueue({
            messageData:JSON.stringify(req.body),
            nameOfChannelQueue:TEMPLATE_GETTER_EVENT_QUEUE_NAME,
            channelData:channelData(),
            successMessage:"Emails are being sent!"
        });

        res.status(200).send(JSON.stringify({
            success:true,
            message:"Sending your emails!"
        }));
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
        const channelData = cache.get("messageBrokerConfig");
        
        addToChannelQueue({
            messageData:JSON.stringify(req.body),
            nameOfChannelQueue:TEMPLATE_CREATOR_EVENT_QUEUE_NAME,
            channelData:channelData(),
            successMessage:"Emails are being sent!"
        });

        res.status(200).send(JSON.stringify({
            success:true,
            message:"Sending your emails!"
        }));
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

app.put("/updateTemplate", async(req)=>{
    try{
        const channelData = cache.get("messageBrokerConfig");
        
        addToChannelQueue({
            messageData:JSON.stringify(req.body),
            nameOfChannelQueue:TEMPLATE_UPDATER_EVENT_QUEUE_NAME,
            channelData:channelData(),
            successMessage:"Emails are being sent!"
        });

        res.status(200).send(JSON.stringify({
            success:true,
            message:"Sending your emails!"
        }));
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

app.post("/deleteTemplate", async(req)=>{
    try{
        const channelData = cache.get("messageBrokerConfig");
        
        addToChannelQueue({
            messageData:JSON.stringify(req.body),
            nameOfChannelQueue:TEMPLATE_DELETER_EVENT_QUEUE_NAME,
            channelData:channelData(),
            successMessage:"Emails are being sent!"
        });

        res.status(200).send(JSON.stringify({
            success:true,
            message:"Sending your emails!"
        }));
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