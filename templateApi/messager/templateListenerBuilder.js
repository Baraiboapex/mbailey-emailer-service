const {
    getMessageFromChannelQueue
} = require("./recieve");
const {
    buildMessageSender
} = require("./builder");

const executeCallbackIfListenerHasOne = (callback)=> (callback ? callback : null);

function createListener({
    nameOfListener,
    funcToExecuteOnEmailRecieved
}){
    try{
        return new Promise((resolve,reject)=>{
            buildMessageSender({
                messagerUrl:process.env.RABIT_MQ_URL
            }).connectToMessageServer().then((channelResponse)=>{
                channelResponse.getChannel((ch)=>{
                    console.log("VLVLVLV");
                    const checkHasNeededFunctions = ch.assertQueue && ch.sendToQueue;
                    const data = ch;
                    
                    if(checkHasNeededFunctions){
                        console.log("GOT IT!");
                        getMessageFromChannelQueue({
                            nameOfChannelQueue:nameOfListener,
                            channelData:ch,
                            callback:executeCallbackIfListenerHasOne(funcToExecuteOnEmailRecieved)
                        });
                        console.log("LISTENER BUILT");
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
    }catch(err){
        console.log(err);
    }
}
 
module.exports={
    createListener
};