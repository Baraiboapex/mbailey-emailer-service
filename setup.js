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

const {
    createEmailListener
} = require("./api/emailSendingAlgorithm/emailListenerBuilder");

const {
    hashes
} = require("./repositories/firebaseDbRepository");

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

const setupMessageBroker = async ()=>{
    const GET_CHANNEL_DATA = async ()=> await createEmailListener({
        funcToExecuteOnEmailRecieved:(emailData)=>{
            console.log("RECIEVED");
            
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
    
    const brokerConfig = await GET_CHANNEL_DATA();

    cache.set("messageBrokerConfig", brokerConfig, 20000);
}

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
}

module.exports={
    cache,
    setupEmailer,
    setupMessageBroker,
    setupFirebaseHashesDb
};