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
    setupFirebaseHashesDb
} = require("./setup");

class Data {
    emailerSetup(){return ({
        cache:cache,
        setupEmailer:setupEmailer
    })}
    senderAlgorithmSetup(){return ({
        cache:cache,
        setupFirebaseHashesDb:setupFirebaseHashesDb
    })}
    setupMainService(){return ({
        setupMessageBroker:setupMessageBroker
    })}
}

module.exports.instance = new Data();