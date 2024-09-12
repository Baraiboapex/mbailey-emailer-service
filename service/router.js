const _ = require("lodash");

const dbRouterInterface = {
  db: {},
  instantiateObject(newDB) {
    this.db = newDB;
  },
  setDBObject(path, value) {
    _.set(this.db, path, value);
    return this.db;
  },
  getDBObject(path) {
    return path !== "" ? _.get(this.db, path) : this.db;
  },
};

const router = (database) => ({
  async getValueByPath({ path }) {
    let dbo = await database.getDatabaseData();
    let currInterface = dbRouterInterface;
    currInterface.instantiateObject(dbo);

    let fetchedItem = currInterface.getDBObject(path);

    return fetchedItem;
  },
  async setValueByPath({ path, value }) {
    let dbo = await database.getDatabaseData();
    let currInterface = dbRouterInterface;
    currInterface.instantiateObject(dbo);

    let updatedData = currInterface.setDBObject(path, value);

    database.updateDatabaseData(updatedData);

    return updatedData;
  },
  async deleteValueByPath({ path }) {
    let dbo = await database.getDatabaseData();
    let currInterface = dbRouterInterface;
    currInterface.instantiateObject(dbo);

    let deletedItem = _.omit(currInterface.db, path);

    database.updateDatabaseData(deletedItem);

    return true;
  },
});

module.exports = {
  router,
};
