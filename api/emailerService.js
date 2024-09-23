//const emailSender = require("./emailSendingAlgorithm/senderAlgorithm");
const jsonHelper = require("./helpers/jsonHelpers");
const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");

const app = express.Router();

const {
    validateObjectFields
} = require("./helpers/dataValidationHelpers");

const {
    EMAIL_MESSENGER_EVENT_QUEUE_NAME
} = require("./messager/queNames");

const {
    addToChannelQueue
} = require("./messager/send");
const {
    buildMessageSender
} = require("./messager/builder");

app.use(bodyParser.json({ type: "application/json" }));

const SEND_EMAIL_API_FIELD_VALIDATORS = [
    {
        fieldName:"messageSenderAddress",
        validatorFunction:(val)=>(val !== null && val !== "" && val !== undefined)
    },
    {
        fieldName:"emailTemplate",
        validatorFunction:(val)=>(val !== null && val !== "" && val !== undefined)
    },
    {
        fieldName:"emailData",
        validatorFunction:(val)=>(val !== null && !(_.isEmpty(val)) && val !== undefined)
    },
    {
        fieldName:"emailSubject",
        validatorFunction:(val)=>(val !== null && val !== "" && val !== undefined)
    },
    {
        fieldName:"peopleToSendEmailTo",
        validatorFunction:(val)=>(val !== null && val.length > 0 && val !== undefined)
    },
];

app.post("/sendEmail",async (req, res)=>{
    try{
        const { 
            template, 
            emailData, 
            emailSubject,
            peopleToEmail
        } = req.body;

        const buildEmailData = {
            messageSenderAddress:process.env.EMAILER_SERVICE_EMAIL,
            emailTemplate:template, 
            emailData, 
            emailSubject,
            peopleToSendEmailTo:peopleToEmail
        };

        const fieldValidatorResult = validateObjectFields({
            objectToValidate:buildEmailData,
            fieldsToValidate:SEND_EMAIL_API_FIELD_VALIDATORS
        });

        if(fieldValidatorResult.allFieldsAreValid){
            
            buildMessageSender({
                messagerUrl:process.env.RABIT_MQ_URL
            }).connectToMessageServer().then((channelResponse)=>{
                channelResponse.getChannel((ch)=>{
                    addToChannelQueue({
                        messageData:JSON.stringify(buildEmailData),
                        nameOfChannelQueue:EMAIL_MESSENGER_EVENT_QUEUE_NAME,
                        channelData:ch
                    });
                });
            }).catch((err)=>{
                console.log("ERR",err);
            });
            
            res.status(200).send(JSON.stringify({
                success:true,
                message:"Sending your emails!"
            }));
        }else{
            throw new Error("All required fields are not filled out or are not correct. \n Missed Fields:" + fieldValidatorResult.invalidFields);
        }
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

module.exports = app;