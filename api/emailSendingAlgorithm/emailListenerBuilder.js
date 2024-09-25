

const {
    getMessageFromChannelQueue
} = require("../messager/recieve");
const {
    buildMessageSender
} = require("../messager/builder");

const {
    EMAIL_MESSENGER_EVENT_QUEUE_NAME
} = require("../messager/queNames");

function createEmailListener({
    funcToExecuteOnEmailRecieved,
}){
    return new Promise((resolve,reject)=>{
        buildMessageSender({
            messagerUrl:process.env.RABIT_MQ_URL
        }).connectToMessageServer().then((channelResponse)=>{
            channelResponse.getChannel((ch)=>{
                const checkHasNeededFunctions = ch.assertQueue && ch.sendToQueue;
                const data = ch;
                
                if(checkHasNeededFunctions){
                    getMessageFromChannelQueue({
                        nameOfChannelQueue:EMAIL_MESSENGER_EVENT_QUEUE_NAME,
                        channelData:ch,
                        callback:funcToExecuteOnEmailRecieved
                    });
                    resolve(()=>data);
                }else{
                    reject({
                        succes:false,
                        message:"Missing base required functions"
                    })
                }
            });
        }).catch((err)=>{
            reject(err);
            console.log("ERR",err);
        });
    });
}
 
module.exports={
    createEmailListener
};