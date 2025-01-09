
const { 
    isMainThread, 
    workerData
} = require('node:worker_threads');

const Data = require("../../setupManager.js");
const data = Data.instance;

const {
    errorLoggingHelper
} = require("../helpers/errorLoggingHelpers");

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
                emailData,
                emailHashId
            })=>{
                return new Promise(async (resolve, reject)=>{
                    try{
                        console.log("TEST ==> ", emailHashId);
                        emailData.emailUrl = setupEmailUrl(emailHashId, emailAddress);
        
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
                        
                        console.log("EMAIL SENDING TO:" + emailAddress);

                        emailer.sendMail(mailToOptions, (err,info)=>{
                            if(err){
                                console.log("NO", err);
                                closeSenderConnection({
                                    emailSender,
                                    hashDb:hDb
                                });
                                throw new Error("Email Not Sent: " + err);
                            }else{
                                console.log("EMAIL SENT TO: "+ emailAddress);
                                closeSenderConnection({
                                    emailSender,
                                    hashDb:hDb
                                });
                                resolve(info);
                            }
                        });
                    }catch(err){
                        console.log(err);
                        errorLoggingHelper(err);
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
        errorLoggingHelper(err);
    }
}

startEmailerProcess();



