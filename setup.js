
const NodeCache = require("node-cache");
const nodemailer = require("nodemailer");

const cache = new NodeCache();

const WorkerPool = require("./api/emailSendingAlgorithm/workerPool");
const {
    createEmailListener
} = require("./api/emailSendingAlgorithm/senderAlgorithm");

const setupEmailer = async ()=>{
    
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

module.exports={
    cache,
    setupEmailer,
    setupMessageBroker
};