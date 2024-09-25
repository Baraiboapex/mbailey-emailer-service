const WorkerPool = require("./workerPool");

const {
    isMainThread, workerData
  } = require('node:worker_threads');
  
  if(!isMainThread){
    
    const Data = require("../../setupManager");

    const data = Data.instance;

    const {
        cache,
        setupFirebaseHashesDb
    } = data.senderAlgorithmSetup();

    const SERVICE_INTERVAL_TIMEOUT = 10000;
    setTimeout(async ()=>{
        await setupFirebaseHashesDb();
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
                
                if(peopleToSendEmailTo){
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
                                
                                const getHash = await cache.get("firebaseHashConfig").getSnapshot(peopleToSendEmailTo[i][5]);

                                emailDataToSend.emailAddress = emailAddress;
                                emailDataToSend.emailHashId = getHash;

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

                }else{
                    return;
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