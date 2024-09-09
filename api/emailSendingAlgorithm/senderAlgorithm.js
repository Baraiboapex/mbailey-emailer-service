

async function startEmailQueue({
    emailSubject,
    emailMessage,
    emailTemplate,
    peopleToSendEmailTo,
}){
  const amountOfEmailsSentBeforePause = 50;
  
  let currentIndex = 0;
  let setStartingIndex = 0;

  while(setStartingIndex < peopleToSendEmailTo.length){
    for(let i = setStartingIndex; i <= amountOfEmailsSentBeforePause; i++){
      currentIndex++;
      const emailAddress = peopleToSendEmailTo[i][2];
      sendEmail({
        emailSubject,
        emailAddress,
        emailMessage,
        emailTemplate
      });
    }
    setStartingIndex = currentIndex;
    await pauseSendingAlgorithm();
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
