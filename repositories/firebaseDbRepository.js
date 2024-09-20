const { getDatabase, ref, child, get, set, goOffline } = require("firebase/database");
const { initializeApp } = require("firebase/app");

const firebaseHashesDbConfig = {
  apiKey: process.env.FIREBASE_PORT,
  authDomain: process.env.FIREBASE_PORT,
  databaseURL: process.env.DATABASE_URL,
  projectId: "japanese-class-hashes",
  storageBucket: "japanese-class-hashes.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const dbContainer = {
  dbObject: null,
  dbInteractor: null,
  async loadHashesDb() {
    await this.createDatabase(firebaseHashesDbConfig , "solutions");
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
  async getData(auth) {
    if (this.dbObject) {
      return new Promise((resolve, reject) => {
        try{
          if(auth){
            if(auth.authData){
              if(auth.authData.hashId){
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
          ref(this.dbInteractor,  "/" + (auth.authData ? auth.authData.hashId : "")),
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

const hashes = () => ({
  getDatabaseRules(val, database) {
    rules.domainMatches(val, database);
  },
  async buildDatabase(){
    const database = await dbContainer.loadHashesDb();
    return database;
  },
});

const firebaseApps = {
  hashes
};

module.exports = firebaseApps;

