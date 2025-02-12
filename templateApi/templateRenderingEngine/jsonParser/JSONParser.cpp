#include <unordered_map>
#include <string>
#include <regex>
#include "JSONParser.h"

using namespace std;

unordered_map<string, string> JSONParser::ParseJSON(string incomingData)
{
    unordered_map<string, string> parsedJSON;
    unordered_map<int, string> keyMatchIndices;

    regex keyPattern(R"(\".*?\"(?=:))");
    regex valuePattern(R"((?<=:)\".*?\")");

    smatch keyMatch;
    smatch valueMatch;

    if (regex_search(incomingData, keyMatch, keyPattern)) {
        for (size_t i = 0; i < keyMatch.size(); ++i) {
            parsedJSON[keyMatch[i]] = "";
            keyMatchIndices[i] = keyMatch[i];
        }
    }

    if (regex_search(incomingData, valueMatch, valuePattern)) {
        for (size_t i = 0; i < valueMatch.size(); ++i) {
            parsedJSON[keyMatchIndices[i]] = valueMatch[i];
        }
    }

    return parsedJSON;
}

string JSONParser::GetJSONDataByKey(unordered_map<string, string> parsedJsonData, string keyToFetchValue)
{
    return parsedJsonData[keyToFetchValue];
}

void JSONParser::Execute()
{
    return;
}
