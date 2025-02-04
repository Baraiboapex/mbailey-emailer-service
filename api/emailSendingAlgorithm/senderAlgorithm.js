const SenderQueue = require("./senderQueue");
const startEmailerProcess = require("./emailSender2");

const {
    isMainThread, workerData, parentPort
  } = require('node:worker_threads');
  
  if(!isMainThread){
    
    const Data = require("../../setupManager");

    const data = Data.instance;

    const {
        cache,
        setupFirebaseHashesDb
    } = data.senderAlgorithmSetup();

    const SERVICE_INTERVAL_TIMEOUT = 20000;
    
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
    };

    function pauseSendingAlgorithm(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            },SERVICE_INTERVAL_TIMEOUT);
        });
    }
    
    async function setupForSending({
        messageSenderAddress,
        emailSubject,
        emailTemplate,
        peopleToSendEmailTo,
        emailData,
        currentIndex,
        batchArray,
        amountOfEmailsSentBeforePause,
        pool2,
      }){
        for (
          let j = currentIndex - (amountOfEmailsSentBeforePause - 1);
          j <= currentIndex;
          j++
        ) {
            const emailDataToSend = {
                messageSenderAddress,
                emailAddress:null,
                emailSubject,
                emailTemplate,
                emailData,
                emailHashId:null
            };

            if(peopleToSendEmailTo[j]){
                console.log("ITERATOR : " + j);
                const isSubscribed = peopleToSendEmailTo[j][4] === "Yes";
    
                console.log("EMAIL ADDRESS", peopleToSendEmailTo[j][2], isSubscribed);
    
                if(isSubscribed){
                    const getHash = await cache.get("firebaseHashConfig").getSnapshot(peopleToSendEmailTo[j][5]);

                    const emailAddress = peopleToSendEmailTo[j][2];

                    emailDataToSend.emailAddress = emailAddress;
                    emailDataToSend.emailHashId = getHash.Hash;
                    
                    batchArray.push(emailDataToSend);
                    
                    console.log("EMAIL BEING SENT TO : ", emailAddress);
                }
            }
        }

        batchArray.forEach((item) => {
            console.log("ITEM", item);
            pool2.addItemToQueue({
                taskName: "emailSender",
                taskProcess: startEmailerProcess,
                taskData: item,
            });
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
            console.log("RECIEVED");
            if(peopleToSendEmailTo){
                if(peopleToSendEmailTo.length > 0){
                    let batchArray = [];
                    await setupFirebaseHashesDb();
                    
                    const emailListLength = peopleToSendEmailTo.length;
                    const specifiedSendAmount = 5;
                    const amountOfEmailsSentBeforePause = (
                        peopleToSendEmailTo.length > specifiedSendAmount ? specifiedSendAmount : emailListLength
                    );

                    console.log("STUFF", peopleToSendEmailTo, "LIST LENGTH", emailListLength);

                    let timesSent = 0;
        
                    const pool2 = new SenderQueue();

                    if(!pool2.queueInUse){
                        for(let currentIndex = 0; currentIndex <= emailListLength; currentIndex++){
                            
                            timesSent++;
                              
                            if(timesSent >= amountOfEmailsSentBeforePause){
                                setupForSending({
                                    messageSenderAddress,
                                    emailSubject,
                                    emailTemplate,
                                    peopleToSendEmailTo,
                                    emailData,
                                    currentIndex,
                                    batchArray,
                                    amountOfEmailsSentBeforePause,
                                    pool2,
                                });
                                await pauseSendingAlgorithm();
                                await pool2.runQueueTasks();
                                console.log(timesSent);
                                batchArray = [];
                                timesSent = 0;
                            } else if (currentIndex + amountOfEmailsSentBeforePause === emailListLength - 1) {
                                setupForSending({
                                    messageSenderAddress,
                                    emailSubject,
                                    emailTemplate,
                                    peopleToSendEmailTo,
                                    emailData,
                                    currentIndex,
                                    batchArray,
                                    amountOfEmailsSentBeforePause,
                                    pool2,
                                });
                                console.log("END!");
                                await pauseSendingAlgorithm();
                                await pool2.runQueueTasks();
                                batchArray = [];
                                timesSent = 0;
                            }
    
                            if (emailListLength < 2) break;
                        }
                        console.log("DONE!");
                        pool2.clearQueue();
                        parentPort.postMessage("DONE");
                    }else{
                        console.log("QUEUE IS IN USE!!!!");
                        return;
                    }
                }else{
                    console.log("NOPE!!!! EMPTY LIST");
                    parentPort.postMessage("DONE");
                }
            }else{
                console.log("LOL REALLY? NO LIST!!!");
                parentPort.postMessage("DONE");
            }
            
        }catch(err){
            console.log("error in email sender : "+err);
        }
    }

    emailWorkerProcess(workerDataToLoad);
  }