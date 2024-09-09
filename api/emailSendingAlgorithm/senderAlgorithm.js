
const nodemailer = require('nodemailer');

async function startEmailQueue({
    messageSenderAdress,
    emailSubject,
    emailMessage,
    emailTemplate,
    peopleToSendEmailTo,
}){
  const amountOfEmailsSentBeforePause = 50;
  
  let currentIndex = 0;
  let setStartingIndex = 0;

  while(setStartingIndex < peopleToSendEmailTo.length){
    for(let i = setStartingIndex; i <= amountOfEmailsSentBeforePause; i++){
      currentIndex++;
      const emailAddress = peopleToSendEmailTo[i][2];
      sendEmail({
        messageSenderAdress,
        emailSubject,
        emailAddress,
        emailMessage,
        emailTemplate
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
    emailMessage,
    emailTemplate
}){
    return new Promise(async (resolve, reject)=>{
        console.log("Sent an email!");
        console.table({ 
            messageSenderAdress,
            emailAddress,
            emailSubject, 
            emailMessage,
            emailTemplate
        });
        
        const emailSender =  nodemailer.createTransport({
            service: 'gmail',
                auth: {
                    user: messageSenderAddress,
                    pass: process.env.EMAILER_SERVICE_PASSWORD
                }
            }
        );

        resolve();
    });
}

export default {
    startEmailQueue
} 
