
function addToChannelQueue({
  messageData,
  nameOfChannelQueue,
  channelData
}){
  return new Promise((resolve,reject)=>{
    try{
      channelData.assertQueue(nameOfChannelQueue, {
        durable: true
      });
      channelData.sendToQueue(nameOfChannelQueue, Buffer.from(messageData),{
        persistent:true
      });
      console.log("sent!");
      resolve({
        success:true,
        message:"Emails are being sent!"
      })
    }catch(err){
      console.log(err);
      reject({
        success:false,
        message:"Could not send emails"
      });
    }
  });
}

module.exports = {
  addToChannelQueue
}
