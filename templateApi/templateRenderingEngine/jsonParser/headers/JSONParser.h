#include <unordered_map>
#include <string>

using namespace std;

#ifndef JSON_PARSER
#define JSON_PARSER

class JSONParser{
    public:
        unordered_map<string, string> ParseJSON(string incommingData);
        string GetJSONDataByKey(unordered_map<string, string> parsedJsonData, string keyToFetchValue);
};

#endif