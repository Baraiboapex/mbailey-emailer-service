const express = require("express");
const app = express.Router();
const emailSender = require("./emailSendingAlgorithm/senderAlgorithm");
const jsonHelper = require("./helpers/jsonHelpers");

app.use(express.json());

app.get("/sendEmail",async (req, res)=>{
    try{
        const {startEmailQueue} = emailSender;
    
        const { 
            template, 
            emailData, 
            emailSubject,
            emailMessage,
            peopleToEmail
        } = req.body;

        const emailerProcessDone = startEmailQueue({
            messageSenderAdress,
            emailSubject:emailSubject,
            emailMessage:emailMessage,
            emailTemplate:template,
            peopleToSendEmailTo:peopleToEmail,
            emailData
        });

        if(emailerProcessDone.success){
            res.status(200).send(JSON.stringify(emailerProcessDone));
        }else{
            throw new Error(JSON.stringify({
                ...emailerProcessDone,
                respCode:400
            }))
        }
    }catch(err){
        const getJsonErrorData = (jsonHelper.tryParsingJson(err) ? jsonHelper.tryParsingJson(err) : err);

        if(getJsonErrorData){
            if(err.respCode){
                res.status(err.respCode).send(JSON.stringify(emailerProcessDone));
            }else{
                res.status(500).send(JSON.stringify(emailerProcessDone));
            }
        }else{
            res.status(500).send(JSON.stringify({
                success:false,
                errorMessage:err
            })); 
        }
    }
    
});