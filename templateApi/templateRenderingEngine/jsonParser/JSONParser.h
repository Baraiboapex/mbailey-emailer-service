#ifndef JSON_PARSER
#define JSON_PARSER

#include <unordered_map>
#include <string>
#include "../taskRouter/interfaces/ITaskFunction.h"

using namespace std;

class JSONParser : public ITaskFunction {
    public:
        JSONParser() = default;
        unordered_map<string, string> ParseJSON(string incomingData);
        string GetJSONDataByKey(unordered_map<string, string> parsedJsonData, string keyToFetchValue);
        void Execute() override;
};

#endif

