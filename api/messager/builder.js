const amqp = require('amqplib/callback_api');

function buildMessageSender({
    messagerUrl
}){
    try{
      return ({
        connection:null,
        connectToMessageServer(){
            return new Promise(async (resolve,reject)=>{
              try{
                amqp.connect(messagerUrl, function(error0, connection){
                  if (error0) {
                    console.log("CANNOT CONNECT TO RABBIT MQ");
                    reject({
                      success:false,
                      message:error0
                    });
                  }else{
                    connection.createChannel((error1, channel)=>{
                      if (error1) {
                        console.log("CANNOT CREATE CHANNEL");
                        reject({
                          success:false,
                          message:error1
                        });
                      }else{
                        console.log("Connected!");
                        resolve({
                            success:true,
                            getChannel:(callback)=>{
                              const getChannel = channel;
                              return callback(getChannel)
                            }
                        });
                      }
                    });
                  }
                });
              }catch(err){
                console.log("ERROR", err);
                reject({
                  success:false,
                  message:err
                });
              }
            });
          },
          disconnectFromServer(){
              this.connection.close();
          }
      });
    }catch(err){
      console.log(err);
    }
  }

  module.exports={
    buildMessageSender
  };