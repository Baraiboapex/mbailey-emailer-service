const express = require("express");
const app = express.Router();
const emailSender = require("./emailSendingAlgorithm/senderAlgorithm");

app.use(express.json());

app.get("/sendEmail",async (req, res)=>{
    const {startEmailQueue} = emailSender;
    
    const { 
        template, 
        emailData, 
        emailSubject,
        emailMessage,
        peopleToEmail
    } = req.body;

    startEmailQueue({
        messageSenderAdress,
        emailSubject:emailSubject,
        emailMessage:emailMessage,
        emailTemplate:template,
        peopleToSendEmailTo:peopleToEmail,
        emailData
    })
});