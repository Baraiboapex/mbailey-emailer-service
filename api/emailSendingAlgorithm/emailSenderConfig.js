const nodemailer = require('nodemailer');

class Emailer {

    currentEmailer={};
    emailerConfig={};

    constructor({
        messageSenderAddress,
        pass
    }){
        this.emailerConfig = {
            user:messageSenderAddress,
            pass
        };
    }
    
    buildCurrentEmailer(){
        this.currentEmailer = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            pool: true,
            host: 'smtp.gmail.com',
            port: 465,
            auth: this.emailerConfig
        });
    }
}

module.exports={
    Emailer
};