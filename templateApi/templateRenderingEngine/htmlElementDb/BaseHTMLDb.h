#ifndef BASE_ELEMENT_DB
#define BASE_ELEMENT_DB

#include <unordered_map>
#include <string>
#include "../taskRouter/interfaces/ITaskFunction.h"

using namespace std;

class BaseHTMLDb : public ITaskFunction {
protected:
    unordered_map<string, string> db;
public:
    BaseHTMLDb(unordered_map<string, string> initDb) : db(initDb) {}

    string GetHTMLDb(string keyToElement) {
        return db[keyToElement];
    }

    void Execute() override {
        return;
    }
};
#endif
