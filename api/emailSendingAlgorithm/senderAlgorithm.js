
const nodemailer = require('nodemailer');
const {
    hashes
} = require("../../repositories/firebaseDbRepository.js");

var workerpool = require("workerpool");

function pauseSendingAlgorithm(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        },5000);
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
        const pool = workerpool.pool(__dirname + '/emailSenderWorker.js',{
            workerType: 'process'
        }); 

        const amountOfEmailsSentBeforePause = (peopleToSendEmailTo.length < 50 ? peopleToSendEmailTo.length : 50);
        const emailListLength = peopleToSendEmailTo.length;
        const hashDb = await hashes().buildDatabase();

        let currentIndex = 0;
        let timesSent = 0;

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
        
        while(emailListLength >= currentIndex + 1){
            for(let i = 0; i <= amountOfEmailsSentBeforePause; i++){
                
                if(peopleToSendEmailTo[i]){
                    timesSent++;
                    const emailAddress = peopleToSendEmailTo[i][2];
                    const emailPoolSenderConfig = {
                        messageSenderAddress,
                        emailSubject,
                        emailAddress,
                        emailTemplate,
                        emailData,
                        emailSender,
                        emailHashId:peopleToSendEmailTo[i][5],
                        hashDb
                    }

                    pool.proxy().then(
                        (process)=>process.startEmailQueueWorker(emailPoolSenderConfig)
                    ).then((res)=>{
                       console.log(res); 
                    }).catch((err)=>{
                        console.log(err);
                    }).then((pool)=>{
                        pool.terminate();
                    });

                    if(timesSent >= amountOfEmailsSentBeforePause){
                        await pauseSendingAlgorithm();
                        timesSent = 0;
                    }
                    console.log("Times Sent " + timesSent);
                    currentIndex++;
                }else{
                    break;
                }
            }
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