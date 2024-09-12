const { getDatabase, ref, child, get, set } = require("firebase/database");
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
    const db = await this.createDatabase(firebaseHashesDbConfig , "solutions");
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
        get(child(this.dbObject, "/" + (auth.authData ? auth.authData.hashId : ""))).then(
          (snap) => {
            const currentDbObject = snap.val();
            const currentSelectedHashObject = currentDbObject[Object.keys(currentDbObject)[0]]
            resolve(currentSelectedHashObject);
          }
        );
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
};

const hashes = () => ({
  getDatabaseRules(val, database) {
    rules.domainMatches(val, database);
  },
  async buildDatabase(){
    const database = await dbContainer.loadHashesDb();
    return database;
  },
  async getDatabaseData({ authData: { hashId } }) {
    return database.getData({auth:{ authData:{ hashId }}});
  },
});

const firebaseApps = {
  hashes
};

module.exports = firebaseApps;

