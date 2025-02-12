/*
    WHY DOES THIS FILE EXIST???
    ==================================
    Sometimes, we need circular depenendencies in node.js this file is 
    designed and written in order to solve this problem! ;) 
*/

const {
    cache,
    setupMessageBroker,
    setupErrorMessageBroker,
    setupFirebaseHTMLTemplateDb
} = require("./setup");

class Data {
    senderAlgorithmSetup(){
        return ({
            cache,
            setupFirebaseHTMLTemplateDb
        });
    }
    setupMainService(){
        return ({
            cache,
            setupMessageBroker
        });
    }
    setupErrorService(){
        return ({
            cache,
            setupErrorMessageBroker
        });
    }
}

module.exports.instance = new Data();