
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

        const emailSender = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            pool: true,
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: messageSenderAddress,
                pass: process.env.EMAILER_SERVICE_PASSWORD
            }
        });

        const senderRef = emailSender;
        
        while(emailListLength >= currentIndex + 1){
            for(let i = 0; i <= amountOfEmailsSentBeforePause; i++){
                if(peopleToSendEmailTo[i]){
                    timesSent++;
                    const emailAddress = peopleToSendEmailTo[i][2];
                    
                    pool.proxy().then(
                        async (process)=>{
                            await process.sendEmail({
                                messageSenderAddress,
                                emailSubject,
                                emailAddress,
                                emailTemplate,
                                emailData,
                                emailSender:senderRef,
                                emailHashId:peopleToSendEmailTo[i][5],
                                hashDb
                            });
                        }
                    ).then((res)=>{
                       console.log("TEST",res); 
                    }).catch((err)=>{
                        console.log(err);
                    }).then((pool)=>{
                        pool.terminate();
                    });

                    if(timesSent >= amountOfEmailsSentBeforePause){
                        await pauseSendingAlgorithm();
                        timesSent = 0;
                    }
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