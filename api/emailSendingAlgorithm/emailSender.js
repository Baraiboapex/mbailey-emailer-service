
const { 
    isMainThread, workerData
  } = require('node:worker_threads');

const Data = require("../../setupManager.js");

const data = Data.instance;

const {
    cache,
    setupEmailer
} = data.emailerSetup();

const {
    generateHTMLTemplate
} = require("../emailTemplates/templateGenerator.js");

const startEmailerProcess = async () =>{
    await setupEmailer();
    try{
        if(!isMainThread){
            function setupEmailUrl (hashId, emailAddress){
                return process.env.EMAIL_UNSUBSCRIBE_LINK + "?email_address="+emailAddress+"&email_hash="+hashId;
            }
            
            const closeSenderConnection = function({
                emailSender
            }){
                emailSender.close();
            };
        
            const sendEmailProcess = ({
                messageSenderAddress,
                emailAddress,
                emailSubject,
                emailTemplate,
                emailData
            })=>{
                return new Promise(async (resolve, reject)=>{
                    try{
                           
                        emailData.emailUrl = setupEmailUrl(emailData.emailHashId, emailAddress);
        
                        const currentEmailTemplate = await generateHTMLTemplate({
                            templateName:emailTemplate,
                            emailData
                        });
        
                        const mailToOptions = {
                            from:  messageSenderAddress,
                            to: emailAddress,
                            subject: emailSubject,
                            html: currentEmailTemplate
                        };
        
                        const emailer = cache.get("emailerConfig");
        
                        emailer.sendMail(mailToOptions, (err,info)=>{
                            if(err){
                                closeSenderConnection({
                                    emailSender,
                                    hashDb:hDb
                                });
                                throw new Error("Email Not Sent: " + err);
                            }else{
                                closeSenderConnection({
                                    emailSender,
                                    hashDb:hDb
                                });
                                resolve(info);
                            }
                        });
                    }catch(err){
                        console.log(err);
                        // reject(JSON.stringify({
                        //     success:false,
                        //     errorMessage:err
                        // }));
                    }
                }); 
            }
        
            sendEmailProcess(workerData)
          }
    }catch(err){
        console.log(err);
    }
}

startEmailerProcess();



