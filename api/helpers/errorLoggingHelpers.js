const crypto = require('crypto');

const {
    addToChannelQueue
} = require("../messager/send");

const {
    ERROR_MESSENGER_EVENT_QUEUE_NAME
} = require("../messager/queNames");

const {
    ERROR_MESSENGER_EXCHANGE
} = require("../messager/exchangeNames");

async function errorLoggingHelper(err, cache){
    try{
        console.log("ERROR IN SENDER : ", err);

        const channelData = cache.get("errorMessageBrokerConfig");
        const errorToSend = JSON.stringify({errorId:crypto.randomUUID(), message:err});

        await addToChannelQueue({
            messageData:errorToSend,
            nameOfChannelQueue:ERROR_MESSENGER_EVENT_QUEUE_NAME,
            channelData:channelData(),
            successMessage:"Error logged",
            exchangeName:ERROR_MESSENGER_EXCHANGE
        });
        
        console.log("SENT ERROR");
    }catch(err){
        console.log("NOPE!!!!!!!");
        console.log(err);
    }
}

module.exports = {
    errorLoggingHelper
};