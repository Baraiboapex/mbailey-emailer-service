/*
    WHY DOES THIS FILE EXIST???
    ==================================
    Sometimes, we need circular depenendencies in node.js this file is 
    designed and written in order to solve this problem! ;) 
*/

const {
    cache,
    setupEmailer,
    setupMessageBroker,
    setupErrorMessageBroker,
    setupFirebaseHashesDb
} = require("./setup");

class Data {
    emailerSetup(){
        return ({
            cache,
            setupEmailer:setupEmailer
        });
    }
    senderAlgorithmSetup(){
        return ({
            cache,
            setupFirebaseHashesDb:setupFirebaseHashesDb
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