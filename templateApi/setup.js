/*
    DO NOT USE THIS FILE DIRECTLY PLEASE!
    USE THE PROVIDED SETUP MANAGER IN ORDER
    TO USE THESE SERVICES TO PREVENT CIRCULAR
    DEPENDENCY ERRORS. THANKS!

    -BARAIBOAPEX =(0-0)=
*/
const NodeCache = require("node-cache");

const cache = new NodeCache();

const WorkerPool = require("./workerPool");

const {NUMBER_OF_CORES_ON_MACHINE} = require("./helpers/environmentHelpers");

const {
    TEMPLATE_MESSAGE_QUEUE,
    ERROR_MESSENGER_EVENT_QUEUE_NAME
} = require("./messager/queNames");
const { errorLoggingHelper } = require("./helpers/errorLoggingHelpers");

const {createListener} = require("./messager/templateListenerBuilder");

const createNewWorker = () => {
    const pool = new WorkerPool({
      numThreads: NUMBER_OF_CORES_ON_MACHINE,
    });
  
    return pool;
};

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
            nameOfListener:TEMPLATE_MESSAGE_QUEUE,
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

const setupFirebaseHTMLTemplateDb = async ()=>{
    const hDb = await templates().buildDatabase();

    const getHash = {
        getSnapshot:async(htmlTemplateId)=>await (hDb).getData({ 
            authData: { 
                hashId:htmlTemplateId
            }
        })
    };

    cache.set("firebaseHashConfig", getHash, 20000);
};

module.exports={
    cache,
    setupMessageBroker,
    setupErrorMessageBroker,
    setupFirebaseHTMLTemplateDb
};