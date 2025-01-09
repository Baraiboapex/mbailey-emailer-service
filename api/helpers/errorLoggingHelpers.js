const {
    addToChannelQueue
} = require("../messager/send");

const {
    ERROR_MESSENGER_EVENT_QUEUE_NAME
} = require("../messager/queNames");

export function errorLoggingHelper(err){
    console.log("ERROR IN SENDER : ", err);

    const channelData = cache.get("messageBrokerConfig");
    const errorToSend = JSON.stringify(err);

    addToChannelQueue({
        messageData:errorToSend,
        nameOfChannelQueue:ERROR_MESSENGER_EVENT_QUEUE_NAME,
        channelData:channelData(),
        successMessage:"Error logged"
    });
    
    console.log("SENT ERROR");
}