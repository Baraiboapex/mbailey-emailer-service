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
            //index
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

                    console.log(emailListLength);

                    for(let currentIndex = 0; currentIndex <= emailListLength; currentIndex++){
                        
                        if(peopleToSendEmailTo[currentIndex]){
                            timesSent++;
                            const emailAddress = peopleToSendEmailTo[currentIndex][2];
                            const isSubscribed = peopleToSendEmailTo[currentIndex][4] === "Yes";
                            
                            const getHash = await cache.get("firebaseHashConfig").getSnapshot(peopleToSendEmailTo[currentIndex][5]);

                            emailDataToSend.emailAddress = emailAddress;
                            emailDataToSend.emailHashId = getHash.Hash;

                            pool.addNewWorker({
                                workerName:"emailSender",
                                workerData:emailDataToSend
                            });
    
                            if(isSubscribed){
                                console.log(getHash, currentIndex);
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
                        }
                        currentIndex++;
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