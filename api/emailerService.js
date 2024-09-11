const express = require("express");
const app = express.Router();
const emailSender = require("./emailSendingAlgorithm/senderAlgorithm");
const jsonHelper = require("./helpers/jsonHelpers");
const testData = require("./testData/testData");

app.use(express.json());

app.post("/sendEmail",async (req, res)=>{
    
    try{
        const { startEmailQueue } = emailSender;
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

        const emailerProcessDone = await startEmailQueue(buildEmailData);
        console.log("process ==> ", emailerProcessDone);

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