const {
    addToChannelQueue
} = require("../messager/send");

const {
    ERROR_MESSENGER_EVENT_QUEUE_NAME
} = require("../messager/queNames");

function errorLoggingHelper(err){
    try{
        console.log("ERROR IN SENDER : ", err);

        const channelData = cache.get("messageBrokerConfig");
        const errorToSend = JSON.stringify({errorId:crypto.randomUUID(), message:err});

        addToChannelQueue({
            messageData:errorToSend,
            nameOfChannelQueue:ERROR_MESSENGER_EVENT_QUEUE_NAME,
            channelData:channelData(),
            successMessage:"Error logged"
        });
        
        console.log("SENT ERROR");
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    errorLoggingHelper
};