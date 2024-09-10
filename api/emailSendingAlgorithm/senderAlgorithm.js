
const nodemailer = require('nodemailer');
const templateGenerator = require("../emailTemplates/templateGenerator.js");

const {generateHTMLTemplate} = templateGenerator;

async function startEmailQueue({
    messageSenderAdress,
    emailSubject,
    emailMessage,
    emailTemplate,
    peopleToSendEmailTo,
    emailData
}){
  const amountOfEmailsSentBeforePause = 50;
  
  let currentIndex = 0;
  let setStartingIndex = 0;

  while(setStartingIndex < peopleToSendEmailTo.length){
    for(let i = setStartingIndex; i <= amountOfEmailsSentBeforePause; i++){
      currentIndex++;
      const emailAddress = peopleToSendEmailTo[i][2];
      await sendEmail({
        messageSenderAdress,
        emailSubject,
        emailAddress,
        emailMessage,
        emailTemplate,
        emailData
      });
    }
    setStartingIndex = currentIndex;
    await pauseSendingAlgorithm();
  }
}

function pauseSendingAlgorithm(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        },3000);
    });
}

function sendEmail({
    messageSenderAdress,
    emailAddress,
    emailSubject,
    emailTemplate,
    emailData
}){
    return new Promise(async (resolve, reject)=>{
        try{
            const currentEmailTemplate = generateHTMLTemplate({
                templateName:emailTemplate,
                emailData
            });
            const emailSenderConfig =  nodemailer.createTransport({
                service: 'gmail',
                    auth: {
                        user: messageSenderAddress,
                        pass: process.env.EMAILER_SERVICE_PASSWORD
                    }
                }
            );

            const mailToOptions = {
                from:  messageSenderAdress,
                to: emailAddress,
                subject: emailSubject,
                html: currentEmailTemplate
            };

            const emailSenderHandler = nodemailer.createTransport(emailSenderConfig) ;

            emailSenderHandler.sendMail(mailToOptions, (err,info)=>{
                if(err){
                    throw err;
                }else{
                    resolve();
                }
            });
        }catch(err){
            reject(err);
        }
    });
}

const emailSender = {
    startEmailQueue
}

export default emailSender;

