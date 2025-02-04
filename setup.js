/*
    DO NOT USE THIS FILE DIRECTLY PLEASE!
    USE THE PROVIDED SETUP MANAGER IN ORDER
    TO USE THESE SERVICES TO PREVENT CIRCULAR
    DEPENDENCY ERRORS. THANKS!

    -BARAIBOAPEX =(0-0)=
*/
const NodeCache = require("node-cache");
const nodemailer = require("nodemailer");

const cache = new NodeCache();

const WorkerPool = require("./api/emailSendingAlgorithm/workerPool");

const {NUMBER_OF_CORES_ON_MACHINE} = require("./api/helpers/environmentHelpers");

const {
    createListener
} = require("./api/emailSendingAlgorithm/emailListenerBuilder");

const {
    hashes
} = require("./repositories/firebaseDbRepository");

const {
    EMAIL_MESSENGER_EVENT_QUEUE_NAME,
    ERROR_MESSENGER_EVENT_QUEUE_NAME
} = require("./api/messager/queNames");
const { errorLoggingHelper } = require("./api/helpers/errorLoggingHelpers");

const createNewWorker = () => {
    //Add a worker pool class which
    //can scale up to use more CPU's
    //if need be.
  
    const pool = new WorkerPool({
      numThreads: NUMBER_OF_CORES_ON_MACHINE,
    });
  
    return pool;
  };

const setupEmailer = async ()=>{
    console.log("EMAILER SETUP");
    const emailSenderConfig = {
        service: 'gmail',
        secure: false,
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAILER_SERVICE_EMAIL,
            pass: process.env.EMAILER_SERVICE_PASSWORD
        }
    }

    let emailSender = nodemailer.createTransport(emailSenderConfig);
    
    cache.set("emailerConfig", emailSender, 20000);

}

const pool = createNewWorker();

const setupErrorMessageBroker = async ()=>{
    const GET_CHANNEL_DATA = async ()=> await createListener({
        nameOfListener:ERROR_MESSENGER_EVENT_QUEUE_NAME
    }).catch((err)=>{
        console.log(err.message);
    });
    
    const brokerConfig = await GET_CHANNEL_DATA();
    
    cache.set("errorMessageBrokerConfig", brokerConfig, 20000);
};

const setupMessageBroker = async ()=>{
    try{
        const GET_CHANNEL_DATA = async ()=> await createListener({
            nameOfListener:EMAIL_MESSENGER_EVENT_QUEUE_NAME,
            funcToExecuteOnEmailRecieved:(emailData, channelData, completeMessage)=>{
                
                pool.addNewWorker({workerName:"senderAlgorithm", workerData:emailData});

                pool.runTask(emailData, (err, result) => {
                    if(err){
                        console.log(err);
                        errorLoggingHelper(err, cache);
                    }
                    channelData.ack(completeMessage);
                    pool.close();
                });
            }
        }).catch((err)=>{
            console.log(err);
        });
        
        const brokerConfig = await GET_CHANNEL_DATA();
    
        console.log(brokerConfig);

        console.log("JOJ");

        cache.set("messageBrokerConfig", brokerConfig, 20000);
    }catch(err){
        console.log("SETUP EMAIL BROKER ERROR", err);
    }
};

const setupFirebaseHashesDb = async ()=>{
    const hDb = await hashes().buildDatabase();

    const getHash = {
        getSnapshot:async(emailHashId)=>await (hDb).getData({ 
            authData: { 
                hashId:emailHashId 
            }
        })
    };

    cache.set("firebaseHashConfig", getHash, 20000);
};

module.exports={
    cache,
    setupEmailer,
    setupMessageBroker,
    setupErrorMessageBroker,
    setupFirebaseHashesDb
};