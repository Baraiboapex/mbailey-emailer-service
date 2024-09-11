const {readHtml} = require("../helpers/fileHelpers")
const handlebars = require('handlebars');

const EMAIL_DATA_KEYS_TO_IGNORE = [
    "subject"
];

async function generateHTMLTemplate({
    templateName,
    emailData
}){
    return new Promise(async (resolve, reject)=>{
        const emailHTMLTemplate = await readHtml(__dirname+"/"+templateName+".html");
        if(emailHTMLTemplate)
        {
            if(emailHTMLTemplate.htmlOutputFunc){
                try{
                    const emailTemplate = loadEmailTemplateData({
                        emailData,
                        htmlTemplate:emailHTMLTemplate.htmlOutputFunc()
                    });
                    resolve(emailTemplate);
                }catch(err){
                    if(err.errorFunc){
                        reject(err.errorFunc());
                    }else{
                        reject(err);
                    }
                }
            }else{
                if(emailHTMLTemplate.errorFunc)
                {
                    console.log(emailHTMLTemplate.errorFunc());
                    reject(emailHTMLTemplate.errorFunc());
                }else{
                    console.log("child data does not exist for emailHTMLTemplate");
                    reject("child data does not exist for emailHTMLTemplate");
                }
            }
        }else{
            console.log("emailHTMLTemplate is null or does not exist");
            reject("emailHTMLTemplate is null or does not exist");
        }
    });
}

function loadEmailTemplateData({
    emailData,
    htmlTemplate
}){
    const temp = handlebars.compile(htmlTemplate);
    const templateVarsToReplace = {};
    
    Object.keys(emailData).forEach(key=>{
        if(!EMAIL_DATA_KEYS_TO_IGNORE.includes(key)){
            templateVarsToReplace[key] = emailData[key];
        }
    });

    const finalTemplate = temp(templateVarsToReplace);

    return finalTemplate;
}

const templateGenerator = {
    generateHTMLTemplate
}

module.exports =  templateGenerator;