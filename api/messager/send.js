
function addToChannelQueue({
  messageData,
  nameOfChannelQueue,
  channelData
}){
  return new Promise((resolve,reject)=>{
    try{
      const checkHasNeededFunctions = channelData.assertQueue && channelData.sendToQueue;

      if(checkHasNeededFunctions){

        channelData.assertQueue(nameOfChannelQueue, {
          durable: true
        });
        channelData.sendToQueue(nameOfChannelQueue, Buffer.from(messageData),{
          persistent:true
        });
        
        resolve({
          success:true,
          message:"Emails are being sent!"
        });

      }else{
        throw new Error("Missing required functions");
      }
      
    }catch(err){
      console.log(err);
      // reject({
      //   success:false,
      //   message:"Could not send emails"
      // });
    }
  });
}

module.exports = {
  addToChannelQueue
}
