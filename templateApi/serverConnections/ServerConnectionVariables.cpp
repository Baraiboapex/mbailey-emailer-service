#include "./ServerConnectionVariables.h"

ServerConnectionVariables::ServerConnectionVariables(unordered_map<string, string>& incommingConfigVariables){
    this->connectionConfig = incommingConfigVariables;
}

void ServerConnectionVariables::AddConnectionVariable(string key, string value){
    this->connectionConfig.insert(key,value);
}

void ServerConnectionVariables::ClearConnectionVariables(){
    this->connectionConfig.clear();
}

unordered_map<string, string> ServerConnectionVariables::GetAllConnectionVariables(){
    return this->connectionConfig;
}

string ServerConnectionVariables::GetSingleConnectionVariable(string keyToGet){
    return this->connectionConfig.at(keyToGet);
}
