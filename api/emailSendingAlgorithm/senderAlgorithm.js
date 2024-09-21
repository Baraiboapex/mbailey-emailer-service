const WorkerPool = require("./workerPool");

const {
    Worker, isMainThread, workerData
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
                const emailerWorker = new Worker(__filename,{
                    workerData:{
                        messageSenderAddress,
                        emailSubject,
                        emailTemplate,
                        peopleToSendEmailTo,
                        emailData
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
        emailData
    } = workerData;

    const workerDataToLoad = {
        messageSenderAddress,
        emailSubject,
        emailTemplate,
        peopleToSendEmailTo,
        emailData
    }

    function pauseSendingAlgorithm(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            },10000);
        });
    }

    async function emailWorkerProcess({
        messageSenderAddress,
        emailSubject,
        emailTemplate,
        peopleToSendEmailTo,
        emailData
    }){
        try{
            const amountOfEmailsSentBeforePause = 5;
            const emailListLength = peopleToSendEmailTo.length;
            
            let currentIndex = 0;
            let timesSent = 0;

            const emailDataToSend = {
                messageSenderAddress,
                emailAddress:null,
                emailSubject,
                emailTemplate,
                emailData,
                emailHashId:null
            };
            
            const pool = new WorkerPool({
                numThreads:amountOfEmailsSentBeforePause,
            });

            while(currentIndex <= emailListLength){
                for(let i = 0; i <= amountOfEmailsSentBeforePause; i++){
                    if(peopleToSendEmailTo[i]){
                        timesSent++;
                        const emailAddress = peopleToSendEmailTo[i][2];
                        const isSubscribed = peopleToSendEmailTo[i][4] === "Yes";

                        emailDataToSend.emailAddress = emailAddress;
                        emailDataToSend.emailHashId = peopleToSendEmailTo[i][5];

                        pool.addNewWorker({
                            workerName:"emailSender",
                            workerData:emailDataToSend
                        });

                        if(isSubscribed){
                            pool.runTask(emailDataToSend, async (err, result) => {
                                if(err){
                                    console.log(err);
                                    pool.close();
                                    throw new Error(JSON.stringify({
                                        success:false,
                                        errorMessage:err
                                    }));
                                }
                                pool.close();
                            });
                        }
                        
                        if(timesSent >= amountOfEmailsSentBeforePause){
                            await pauseSendingAlgorithm();
                            timesSent = 0;
                        }

                        currentIndex++;
                    }
                }
            }
        }catch(err){
            console.log("ERRRRRRR",err);
            throw new Error(JSON.stringify({
                success:false,
                errorMessage:err
            }));
        }
    }

    emailWorkerProcess(workerDataToLoad);
  }