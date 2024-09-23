function getMessageFromChannelQueue({
    nameOfChannelQueue,
    channelData,
    callback
}){
    return new Promise((resolve,reject)=>{
        try{
            channelData.assertQueue(nameOfChannelQueue, {
                durable: true
            });

            channelData.prefetch(2);

            console.log(" [*] Waiting for email messages in %s. To exit press CTRL+C", nameOfChannelQueue);
            
            channelData.consume(nameOfChannelQueue, function(msg) {
                if(msg.content){
                    console.log("DONE!");
                    channelData.ack(msg);
                    resolve({
                        success:true,
                        callback:callback(JSON.parse(msg.content)),
                    });
                }else{
                    reject({
                        success:false,
                        message:"Could not send emails"
                    });
                }
            }, {
                noAck: false
            });
        }catch(err){
            console.log(err);
            reject({
                success:false,
                message:"Could not send emails"
            });
        }
    });
}

module.exports={
    getMessageFromChannelQueue
};