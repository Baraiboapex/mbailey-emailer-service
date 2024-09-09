const {readHtml} = require("../helpers/fileHelpers")

async function generateHTMLTemplate({
    templateName,
    emailData
}){
    
    const emailHTMLTemplate = await readHtml(__dirname+"/"+templateName+",html");

    return new Promise((resolve, reject)=>{
        emailHTMLTemplate.htmlOutputFunc((err, html)=>{
            try{
                const htmlTemplate = html;
                const loadedEmailTemplate = loadEmailTemplateData({
                    emailData,
                    htmlTemplate
                });
                resolve(loadedEmailTemplate);
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
    let currentTemplate = htmlTemplate;

    Object.keys(emailData).forEach(key=>{
        currentTemplate = htmlTemplate.replace("{{"+key+"}}",emailData[key]);
    });

    return currentTemplate;
}

export default {
    generateHTMLTemplate
}