#include <unordered_map>
#include <string>
#include <regex>

#include "headers/JSONParser.h"

using namespace std;

unordered_map<string, string> JSONParser::ParseJSON(string incommingData)
{
    //REGEX to use : | ".*?"(?=:) |

    unordered_map<string,string> parsedJSON;
    unordered_map<int,string> keyMatchIndices;

    regex keyPattern(R"(\".*?\"(?=:))");
    regex valuePattern(R"((?<=:)\".*?\")");

    smatch keyMatch;
    smatch valueMatch;

    if(regex_search(incommingData, keyMatch, keyPattern))
    {
        for(int i = 0; i <= keyMatch.size()-1; i++)
        {
            parsedJSON[keyMatch[i]] = "";
            keyMatchIndices[i] = keyMatch[i];
        }
    }

    if(regex_search(incommingData, valueMatch, valuePattern))
    {
        for(int i = 0; i <= valueMatch.size()-1; i++)
        {
            parsedJSON[keyMatchIndices[i]] = valueMatch[i];
        }
    }

    return parsedJSON;
};

string JSONParser::GetJSONDataByKey(unordered_map<string, string> parsedJsonData, string keyToFetchValue)
{
    return parsedJsonData[keyToFetchValue];
};
