const WorkerPool = require("./workerPool");

const {
    getMessageFromChannelQueue
} = require("../messager/recieve");
const {
    buildMessageSender
} = require("../messager/builder");

const {
    EMAIL_MESSENGER_EVENT_QUEUE_NAME
} = require("../messager/queNames");

const {
    isMainThread, workerData
  } = require('node:worker_threads');
  
  if(isMainThread){
    buildMessageSender({
        messagerUrl:process.env.RABIT_MQ_URL
    }).connectToMessageServer().then((channelResponse)=>{
        channelResponse.getChannel((ch)=>{
            getMessageFromChannelQueue({
                nameOfChannelQueue:EMAIL_MESSENGER_EVENT_QUEUE_NAME,
                channelData:ch,
                callback:(emailData)=>{
                    const pool = new WorkerPool({
                        numThreads:2,
                        workers:[
                            {workerName:"senderAlgorithm", workerData:emailData}
                        ]
                    });

                    pool.runTask(emailData, (err, result) => {
                        pool.close();
                    });
                }
            });
        });
    }).catch((err)=>{
        console.log("ERR",err);
    });
  }else{
    const SERVICE_INTERVAL_TIMEOUT = 10000;
    setTimeout(()=>{
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
    },SERVICE_INTERVAL_TIMEOUT);
  }