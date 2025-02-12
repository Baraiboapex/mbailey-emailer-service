const hasCallback = ({callback, message, channelData})=> callback ? callback(JSON.parse(message.content), channelData, message) : null;
const {NUMBER_OF_CORES_ON_MACHINE} = require("../helpers/environmentHelpers");

async function getMessageFromChannelQueue({
    nameOfChannelQueue,
    channelData,
    callback
}){
    try{
        channelData.assertQueue(nameOfChannelQueue, {
            durable: true
        });

        channelData.prefetch(NUMBER_OF_CORES_ON_MACHINE);

        console.log(" [*] Waiting for email messages in %s. To exit press CTRL+C", nameOfChannelQueue);
        
        channelData.consume(nameOfChannelQueue,(msg)=>{
            hasCallback({callback, message:msg, channelData});
        });
        
    }catch(err){
        console.log("NOPE", err);
        return {
            success:false,
            message:"Could not send emails"
        };
    }
}

module.exports={
    getMessageFromChannelQueue
};