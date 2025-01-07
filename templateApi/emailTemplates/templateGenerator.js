//const {readHtml} = require("../helpers/fileHelpers");
const handlebars = require('handlebars');
const {spawn} = require('child_process');

const EMAIL_DATA_KEYS_TO_IGNORE = [
    "subject"
];

async function generateHTMLTemplate({
    templateName,
    emailData
}){
    return new Promise(async (resolve, reject)=>{
        const emailHTMLTemplate = await readHtml(__dirname+"/"+templateName+".html");
        try{
            const cppHTMLGeneraterScript = null;
        }catch(err){
            reject("Could not generate an HTML template");
        }
    });
};

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