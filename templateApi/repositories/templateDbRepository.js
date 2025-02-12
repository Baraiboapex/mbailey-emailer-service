const { getDatabase, ref, child, get, set, goOffline } = require("firebase/database");
const { initializeApp } = require("firebase/app");

const firebaseTemplatesDbConfig = {
  apiKey: process.env.TEMPLATES_FIREBASE_API_KEY,
  authDomain: process.env.TEMPLATE_FIREBASE_PORT,
  databaseURL: process.env.TEMPLATE_DATABASE_URL,
  projectId: "emailer-templates-db",
  storageBucket: "emailer-templates-db.firebasestorage.app",
  messagingSenderId: process.env.TEMPLATE_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.TEMPLATE_FIREBASE_APP_ID,
  measurementId: process.env.TEMPLATE_FIREBASE_MEASUREMENT_ID,
};

const dbContainer = {
  dbObject: null,
  dbInteractor: null,
  async loadTemplatesDb() {
    await this.createDatabase(firebaseTemplatesDbConfig , "templates");
    return this;
  },
  async createDatabase(config, name) {
    const dbInitializer = initializeApp(config, name);
    const db = getDatabase(dbInitializer);
    const dbObj = ref(db);

    this.dbInteractor = db;
    this.dbObject = dbObj;
    return Promise.resolve(true);
  },
  async getData(template) {
    if (this.dbObject) {
      return new Promise((resolve, reject) => {
        try{
          if(template){
            if(template.templateData){
              if(template.templateData.id){
                get(child(this.dbObject, "/")).then(
                  (snap) => {
                    const allData = snap.val();
                    const objectKeys = Object.keys(allData).join(", ");
                    const currentObjectKeyFinder = new RegExp("("+auth.authData.hashId+"_)(.*?)(?=,)","g");
                    const getSelectedKey = objectKeys.match(currentObjectKeyFinder)[0];
                    const selectedObject = allData[getSelectedKey];
                    const finalRetrivedObject = selectedObject[Object.keys(selectedObject)[0]];
                    
                    resolve(finalRetrivedObject)
                  }
                );     
              }else{
                throw new Error("You must provide an auth id to search for")
              }
            }else{
              throw new Error("No authorization object found to get hash Id");
            }
          }else{
            throw new Error("No base data found for getting hash Id")
          }
        }catch(err){
          reject(err);
        }
      });
    }
  },
  async saveDataChanges(databaseObject, auth) {
    if (this.dbObject) {
      return new Promise((resolve, reject) => {
        set(
          ref(this.dbInteractor,  "/" + (auth.templateData ? auth.templateData.hashId : "")),
          databaseObject
        ).then(() => {
          resolve(true);
        });
      });
    }
  },
  closeDatabaseConnection(){
    goOffline(this.dbInteractor);
  }
};

const templates = () => ({
  getDatabaseRules(val, database) {
    rules.domainMatches(val, database);
  },
  async buildDatabase(){
    const database = await dbContainer.loadTemplatesDb();
    return database;
  },
});

const firebaseApps = {
    templates
};

module.exports = firebaseApps;

