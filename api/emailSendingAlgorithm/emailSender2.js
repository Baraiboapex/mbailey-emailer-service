
const Data = require("../../setupManager.js");
const data = Data.instance;

const {
    cache,
    setupEmailer
} = data.emailerSetup();

const {
    generateHTMLTemplate
} = require("../emailTemplates/templateGenerator.js");

const setupEmailUrl = (hashId, emailAddress)=>{
    return process.env.EMAIL_UNSUBSCRIBE_LINK + "?email_address="+emailAddress+"&email_hash="+hashId;
}

const closeSenderConnection = ({
    emailSender
})=>{
    emailSender.close();
};

const startEmailerProcess = async (workerData) =>{
    await setupEmailer();
    try{
        
        const sendEmailProcess = ({
            messageSenderAddress,
            emailAddress,
            emailSubject,
            emailTemplate,
            emailData,
            emailHashId
        })=>{
            return new Promise(async (resolve, reject)=>{
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
                        console.log("NO JOJ");
                        closeSenderConnection({
                            emailSender:emailer,
                        });
                        console.log("FIIIF");
                        reject("Email Not Sent: " + err);
                    }else{
                        console.log("EMAIL SENT TO: "+ emailAddress);
                        closeSenderConnection({
                            emailSender:emailer,
                        });
                        resolve(info);
                    }
                });
            }).catch((err)=>{
                throw new Error(err);
            }); 
        }
    
        sendEmailProcess(workerData)
    }catch(err){
        console.log("Error in sender : " + err);
        throw new Error(err);
    }
}

module.exports = startEmailerProcess;



