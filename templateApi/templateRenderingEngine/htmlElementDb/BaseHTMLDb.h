#include <unordered_map>
#include <string>

using namespace std;

#ifndef BASE_ELEMENT_DB
#define BASE_ELEMENT_DB

class BaseHTMLDb{
    protected:
         unordered_map<string, string> db;
    public:
        BaseHTMLDb(unordered_map<string, string> db);
        string GetHTMLDb(string keyToElement);
};

#endif