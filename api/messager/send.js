function addToChannelQueue({
  messageData,
  nameOfChannelQueue,
  channelData,
  successMessage,
  exchangeName
}){
  return new Promise((resolve,reject)=>{
    try{
      
      const checkHasNeededFunctions = channelData.assertQueue && channelData.sendToQueue;

      if(checkHasNeededFunctions){
        console.log("SENT");
        channelData.assertQueue(nameOfChannelQueue, {
          durable: true
        });
        channelData.sendToQueue(nameOfChannelQueue, Buffer.from(messageData),{
          persistent:true
        },(err,ok)=>{
          if(err){
            console.log("ERROR SENDING TO QUEUE : " + err)
          }
          console.log("sent to queue!!");
        });
        
        if(exchangeName){

          channelData.assertExchange(exchangeName, 'direct', {
            durable:true
          });

          channelData.bindQueue(nameOfChannelQueue, exchangeName, "error_route");
          
          resolve({
            success:true,
            message:successMessage
          });
        }
      }else{
        throw new Error("Missing required functions");
      }
      
    }catch(err){
      console.log(err);
    }
  });
}

module.exports = {
  addToChannelQueue
}
