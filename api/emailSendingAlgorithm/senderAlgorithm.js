
const nodemailer = require('nodemailer');
const templateGenerator = require("../emailTemplates/templateGenerator.js");
const {
    hashes
} = require("../../repositories/firebaseDbRepository.js");

const {generateHTMLTemplate} = templateGenerator;

var workerpool = require("workerpool");


function setupEmailUrl (hashId, emailAddress){
    return process.env.EMAIL_UNSUBSCRIBE_LINK + "?email_address="+emailAddress+"&email_hash="+hashId;
}

  function sendEmail({
    messageSenderAddress,
    emailAddress,
    emailSubject,
    emailTemplate,
    emailData,
    emailSender,
    emailHashId,
    hashDb
}){
    return new Promise(async (resolve, reject)=>{
        try{
            const getHash = await hashDb.getData({ 
                authData: { 
                    hashId:emailHashId 
                } 
            });
            
            emailData.emailUrl = setupEmailUrl(getHash, emailAddress);

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

function startEmailQueueWorker({
    messageSenderAddress,
    emailSubject,
    emailTemplate,
    peopleToSendEmailTo,
    emailData
}) {
  return new Promise(async (resolve, reject) => {
    try{
        const amountOfEmailsSentBeforePause = (peopleToSendEmailTo.length < 10 ? peopleToSendEmailTo.length : 10);
            const emailListLength = peopleToSendEmailTo.length;
            const hashDb = await hashes().buildDatabase();

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
            
            for(let currentIndex = 0; currentIndex <= emailListLength; currentIndex++){
                const emailAddress = peopleToSendEmailTo[currentIndex][2];
                
                await sendEmail({
                    messageSenderAddress,
                    emailSubject,
                    emailAddress,
                    emailTemplate,
                    emailData,
                    emailSender,
                    emailHashId:peopleToSendEmailTo[currentIndex][5],
                    hashDb
                });

            }

        resolve({
            success:true,
            message:"Sending your emails!"
        });
    }catch(err){
        console.log("ACTUAL ERROR: "+err);
        reject({
            success:false,
            errorMessage:"Could not send Emails"
        });
    }
  });
}

workerpool.worker({
    startEmailQueueWorker:startEmailQueueWorker
});