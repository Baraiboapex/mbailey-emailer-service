const asyncScriptExecutionAddon = require("./addon/build/Release/addon");

const templateCreatorWorker = (data) => {
    return new Promise(async (resolve, reject)=>{
        try{    
            await asyncScriptExecutionAddon(data);
            resolve();
        }catch(err){
            reject(new Error("Could not " + data.templateProcess + " template"));
        }
    });
}

module.exports = {
    templateCreatorWorker
};