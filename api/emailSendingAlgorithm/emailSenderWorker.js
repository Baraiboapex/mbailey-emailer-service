const workerpool = require("workerpool");

const {
    Emailer
} = require("./emailSenderConfig.js");

const {
    hashes
} = require("../../repositories/firebaseDbRepository.js");
const {
    generateHTMLTemplate
} = require("../emailTemplates/templateGenerator.js");

function setupEmailUrl (hashId, emailAddress){
    return process.env.EMAIL_UNSUBSCRIBE_LINK + "?email_address="+emailAddress+"&email_hash="+hashId;
}

const hashDb = async function(){return await hashes().buildDatabase()};

function sendEmail(props){
    const {
        messageSenderAddress,
        emailSubject,
        emailAddress,
        emailTemplate,
        emailData,
        emailHashId,
        sender
    }=props;
    return new Promise(async (resolve, reject)=>{
        try{
            const getHash = await (await hashDb()).getData({ 
                authData: { 
                    hashId:emailHashId 
                } 
            });
            
            emailData.emailUrl = setupEmailUrl(getHash, emailAddress);

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

            const test = JSON.parse(sender.sendMailFunc);

            console.log(test);

            test.sendMail(mailToOptions, (err,info)=>{
                if(err){
                    console.log(err);
                    throw err;
                }else{
                    resolve();
                }
            });
            
        }catch(err){
            console.log(err);
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