#ifndef JSON_PARSER
#define JSON_PARSER

#include <string>
#include <unordered_map>
#include <iostream>
#include "../taskRouter/interfaces/ITaskFunction.h"
#include "../json.hpp"

using json = nlohmann::json;

class JSONParser : public ITaskFunction {
    private:
    public:
        JSONParser() = default;

        unordered_map<string, string> ParseJSON(string incomingData) {
        
            unordered_map<string, string> parsedJSON;
            try {
                json j = json::parse(incomingData);
        
                for (json::iterator it = j.begin(); it != j.end(); ++it) {
                    if (it.value().is_string()) {
                        parsedJSON[it.key()] = it.value().get<string>();
                    } else {
                        parsedJSON[it.key()] = it.value().dump();
                    }
                }
            } catch (json::parse_error& e) {
                cerr << "JSON parse error: " << e.what() << endl;
                // Handle the error appropriately
            }
        
            return parsedJSON;
        }

        json ParseJSONArrayDataOnly(string incomingData) {
        
            json parsedJSON;
            try {
                json j = json::parse(incomingData);
        
                parsedJSON = j;
            } catch (json::parse_error& e) {
                cerr << "JSON parse error: " << e.what() << endl;
                // Handle the error appropriately
            }
        
            return parsedJSON;
        }

        string GetJSONDataByKey(unordered_map<string, string> parsedJsonData, string keyToFetchValue) {
            return parsedJsonData[keyToFetchValue];
        }

        void Execute() override {
            return;
        }
};

#endif