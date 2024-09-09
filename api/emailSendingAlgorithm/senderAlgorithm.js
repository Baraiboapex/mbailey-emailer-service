

function startEmailQueue({
    emailSubject,
    emailMessage,
    emailTemplate,
    peopleToSendEmailTo,
}){
  const amountOfEmailsSentBeforePause = 50;
  
  let currentIndex = 0;
  
  while(currentIndex <= peopleToSendEmailTo.length){
    for(let i = 0; i <= amountOfEmailsSentBeforePause; i++){
      const emailAddress = peopleToSendEmailTo[i][2];
      sendEmail({
        emailSubject,
        emailAddress,
        emailMessage,
        emailTemplate
      });
    }
  }
}

function pauseSendingAlgorithm(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        },3000);
    });
}

function sendEmail({
    emailAddress,
    emailSubject,
    emailMessage,
    emailTemplate
}){
    return new Promise((resolve, reject)=>{
        console.log("Sent an email!");
        console.table({ 
            emailAddress,
            emailSubject, 
            emailMessage,
            emailTemplate
        });
        resolve();
    });
}

export default {
    startEmailQueue
} 
