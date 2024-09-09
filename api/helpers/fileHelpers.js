const fs = require('fs');

function readHtml(path, callWhenDone){
    fs.readFile(path,{encoding:"utf-8"},(caughtError, HTMLOutput)=>{(
        caughtError ?
        Promise.reject({
            errorFunc:callWhenDone(caughtError)
        })
        :
        Promise.resolve({
            htmlOutputFunc:callWhenDone(null, HTMLOutput)
        })
    )});
}

export default {
    readHtml
}