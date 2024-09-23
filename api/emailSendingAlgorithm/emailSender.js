
const { 
    isMainThread, workerData
  } = require('node:worker_threads');

const {
    cache
} = require("../../setup.js");

  const {
    hashes
} = require("../../repositories/firebaseDbRepository.js");
const {
    generateHTMLTemplate
} = require("../emailTemplates/templateGenerator.js");

  if(!isMainThread){
    function setupEmailUrl (hashId, emailAddress){
        return process.env.EMAIL_UNSUBSCRIBE_LINK + "?email_address="+emailAddress+"&email_hash="+hashId;
    }
    
    const hashDb = async function(){return await hashes().buildDatabase()};
    const closeSenderAndHashDBConnections = function({
        emailSender,
        hashDb
    }){
        emailSender.close();
        hashDb.closeDatabaseConnection();
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
                const hDb = await hashDb();
                const getHash = await (hDb).getData({ 
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

                const emailer = cache.get("emailerConfig")

                console.log("SENDER", emailer);

                // emailer.sendMail(mailToOptions, (err,info)=>{
                //     if(err){
                //         closeSenderAndHashDBConnections({
                //             emailSender,
                //             hashDb:hDb
                //         });
                //         reject(err);
                //     }else{
                //         closeSenderAndHashDBConnections({
                //             emailSender,
                //             hashDb:hDb
                //         });
                //         resolve(info);
                //     }
                // });
            }catch(err){
                console.log(err);
                reject(JSON.stringify({
                    success:false,
                    errorMessage:err
                }));
            }
        }); 
    }

    sendEmailProcess(workerData)
  }

