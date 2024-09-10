const {readHtml} = require("../helpers/fileHelpers")
const handlebars = require('handlebars');

async function generateHTMLTemplate({
    templateName,
    emailData
}){
    return new Promise(async (resolve, reject)=>{
        const emailHTMLTemplate = await readHtml(__dirname+"/"+templateName+",html");
        emailHTMLTemplate.htmlOutputFunc((err, htmlOut)=>{
            try{
                const emailTemplate = loadEmailTemplateData({
                    emailData,
                    htmlTemplate:htmlOut
                });
                resolve(emailTemplate);
            }catch(err){
                if(err.errorFunc){
                    reject(err.errorFunc());
                }else{
                    reject(err);
                }
            }
        });
    });
}

function loadEmailTemplateData({
    emailData,
    htmlTemplate
}){
    const temp = handlebars.compile(htmlTemplate);
    const templateVarsToReplace = {};

    Object.keys(emailData).forEach(key=>{
        templateVarsToReplace[key] = emailData[key]; 
    });

    const finalTemplate = temp(templateVarsToReplace);

    return finalTemplate;
}

const templateGenerator = {
    generateHTMLTemplate
}

export default templateGenerator;