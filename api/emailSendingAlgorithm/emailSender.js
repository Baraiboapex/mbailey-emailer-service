const nodemailer = require('nodemailer');
const {
    Worker, isMainThread, workerData
  } = require('node:worker_threads');

  const {
    hashes
} = require("../../repositories/firebaseDbRepository.js");
const {
    generateHTMLTemplate
} = require("../emailTemplates/templateGenerator.js");

  if(isMainThread){
    function sendEmail({
        messageSenderAddress,
        emailAddress,
        emailSubject,
        emailTemplate,
        emailData
    }){
        try{
            const emailerSenderWorker = new Worker(__filename,{
                workerData:{
                    messageSenderAddress,
                    emailAddress,
                    emailSubject,
                    emailTemplate,
                    emailData
                }
            });
            emailerSenderWorker.on('message', (value)=>{
                console.log(value);
            });
            emailerSenderWorker.on('error', (err)=>{
                console.log(JSON.parse(err));
            });
            emailerSenderWorker.on('exit', (code) => {
                if (code !== 0){
                    console.log({
                        success:false,
                        errorMessage:`emailWorker stopped with exit code ${code}`
                    });
                }
            });
            resolve({
                success:true,
                message:"Sent an email!"
            });
        }catch(err){
            reject({
                success:false,
                errorMessage:"Could not send an email to \""+ emailAddress+"\""
            });
        }
    }

    module.exports={
        sendEmail
    }
  }else{
    function setupEmailUrl (hashId, emailAddress){
        return process.env.EMAIL_UNSUBSCRIBE_LINK + "?email_address="+emailAddress+"&email_hash="+hashId;
    }
    
    const hashDb = async function(){return await hashes().buildDatabase()};
    
    sendEmailProcess(workerData)
    
    function sendEmailProcess({
        messageSenderAddress,
        emailAddress,
        emailSubject,
        emailTemplate,
        emailData,
        emailHashId
    }){
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
                
                const emailSenderConfig = {
                    service: 'gmail',
                    secure: false,
                    pool: true,
                    host: 'smtp.gmail.com',
                    port: 465,
                    auth: {
                        user: messageSenderAddress,
                        pass: process.env.EMAILER_SERVICE_PASSWORD
                    }
                }

                const mailToOptions = {
                    from:  messageSenderAddress,
                    to: emailAddress,
                    subject: emailSubject,
                    html: currentEmailTemplate
                };

                const emailSender =  nodemailer.createTransport(emailSenderConfig);

                emailSender.sendMail(mailToOptions, (err,info)=>{
                    if(err){
                        reject(err);
                        emailSender.close();
                    }else{
                        emailSender.close();
                        resolve(info);
                    }
                });

                
            }catch(err){
                console.log(err);
                reject(JSON.stringify({
                    success:false,
                    errorMessage:err
                }));
            }
        }); 
    }
  }

