const workerpool = require("workerpool");

const templateGenerator = require("../emailTemplates/templateGenerator.js");

const {generateHTMLTemplate} = templateGenerator;

function setupEmailUrl (hashId, emailAddress){
    return process.env.EMAIL_UNSUBSCRIBE_LINK + "?email_address="+emailAddress+"&email_hash="+hashId;
}

function sendEmail(props){
    const {
        messageSenderAddress,
        emailAddress,
        emailSubject,
        emailTemplate,
        emailData,
        emailSender,
        emailHashId,
        hashDb
    } = props;
    return new Promise(async (resolve, reject)=>{
        try{
            // const getHash = await hashDb.getData({ 
            //     authData: { 
            //         hashId:emailHashId 
            //     } 
            // });
            
            //emailData.emailUrl = setupEmailUrl(getHash, emailAddress);

            // const currentEmailTemplate = await generateHTMLTemplate({
            //     templateName:emailTemplate,
            //     emailData
            // });
            
            const mailToOptions = {
                from:  messageSenderAddress,
                to: emailAddress,
                subject: emailSubject,
                html: currentEmailTemplate
            };

            console.log(mailToOptions, emailSender);
            // emailSender.sendMail(mailToOptions, (err,info)=>{
            //     if(err){
            //         console.log(err);
            //         throw err;
            //     }else{
            //         resolve();
            //     }
            // });
        }catch(err){
            throw new Error(JSON.stringify({
                success:false,
                errorMessage:err
            }));
        }
    });
}

workerpool.worker({
    sendEmail:sendEmail
});