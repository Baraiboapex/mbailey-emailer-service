const fs = require('fs');

function readHtml(path){
    return new Promise((resolve,reject)=>{
        fs.readFile(path,{encoding:"utf-8"},(caughtError, HTMLOutput)=>{
            return(
                caughtError ?
                reject({
                    errorFunc:()=>caughtError
                })
                :
                resolve({
                    htmlOutputFunc:()=>HTMLOutput
                })
            );
        });
    });
}

module.exports =  {
    readHtml
}