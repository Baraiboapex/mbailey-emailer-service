
const nodemailer = require('nodemailer');
const templateGenerator = require("../emailTemplates/templateGenerator.js");

const {generateHTMLTemplate} = templateGenerator;

const {
    Worker, isMainThread, parentPort, workerData
  } = require('node:worker_threads');
  
  if(isMainThread){
    function startEmailQueue({
        messageSenderAddress,
        emailSubject,
        emailTemplate,
        peopleToSendEmailTo,
        emailData
    }){
        return new Promise(async (resolve,reject)=>{
            try{
                const emailSenderConfig = {
                    service: 'gmail',
                    secure: true,
                    pool: true,
                    host: 'smtp.gmail.com',
                    port: 465,
                    auth: {
                        user: messageSenderAddress,
                        pass: process.env.EMAILER_SERVICE_PASSWORD
                    }
                };

                const emailSender =  nodemailer.createTransport(emailSenderConfig);

                const emailerWorker = new Worker(__filename,{
                    workerData:{
                        messageSenderAddress,
                        emailSubject,
                        emailTemplate,
                        peopleToSendEmailTo,
                        emailData,
                        emailSender
                    }
                });
                emailerWorker.on('message', (value)=>{
                    console.log(value);
                });
                emailerWorker.on('error', (err)=>{
                    console.log(JSON.parse(err));
                });
                emailerWorker.on('exit', (code) => {
                    if (code !== 0){
                        console.log({
                            success:false,
                            errorMessage:`emailWorker stopped with exit code ${code}`
                        });
                    }
                });
                resolve({
                    success:true,
                    message:"Sending your emails!"
                });
            }catch(err){
                reject({
                    success:false,
                    errorMessage:"Could not send Emails"
                });
            }
            
        })
    };
    module.exports = {
        startEmailQueue
    }
  }else{
    const {
        messageSenderAddress,
        emailSubject,
        emailTemplate,
        peopleToSendEmailTo,
        emailData,
        emailSender
    } = workerData;

    const workerDataToLoad = {
        messageSenderAddress,
        emailSubject,
        emailTemplate,
        peopleToSendEmailTo,
        emailData,
        emailSender
    }

    function pauseSendingAlgorithm(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            },10000);
        });
    }

    function sendEmail({
        messageSenderAddress,
        emailAddress,
        emailSubject,
        emailTemplate,
        emailData,
        emailSender
    }){
        return new Promise(async (resolve, reject)=>{
            try{
                const currentEmailTemplate = await generateHTMLTemplate({
                    templateName:emailTemplate,
                    emailData
                });
                
                const mailToOptions = {
                    from:  messageSenderAddress,
                    to: emailAddress,
                    subject: emailSubject,
                    html: currentEmailTemplate
                };

                emailSender.sendMail(mailToOptions, (err,info)=>{
                    if(err){
                        console.log(err);
                        throw err;
                    }else{
                        resolve();
                    }
                });
            }catch(err){
                throw new Error(JSON.stringify({
                    success:false,
                    errorMessage:err
                }));
            }
        });
    }

    async function emailWorkerProcess({
        messageSenderAddress,
        emailSubject,
        emailTemplate,
        peopleToSendEmailTo,
        emailData,
        emailSender
    }){
        try{
            const amountOfEmailsSentBeforePause = 10;
            const emailListLength = peopleToSendEmailTo.length;
            
            let currentIndex = 0;
            let timesSent = 0;

            const isNotEndOfEmailList = currentIndex <= emailListLength;

            while(isNotEndOfEmailList){
                for(let i = 0; i <= amountOfEmailsSentBeforePause; i++){
                    timesSent++;
                    const emailAddress = peopleToSendEmailTo[i][2];

                    await sendEmail({
                        messageSenderAddress,
                        emailSubject,
                        emailAddress,
                        emailTemplate,
                        emailData,
                        emailSender
                    });
    
                    console.log("Times Sent" + timesSent);
    
                    if(timesSent >= amountOfEmailsSentBeforePause){
                        await pauseSendingAlgorithm();
                        timesSent = 0;
                    }

                    currentIndex++;
                }
            }
           
            parentPort.postMessage({
                success:true,
                successMessage:"Emails sent to students!"
            });

        }catch(err){
            console.log(err);
            throw new Error(JSON.stringify({
                success:false,
                errorMessage:err
            }));
        }
    }

    emailWorkerProcess(workerDataToLoad);
  }

