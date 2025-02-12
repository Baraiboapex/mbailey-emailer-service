#include "./ServerConnectionData.h"

void ServerConnectionData::SetAllowedHTTPOperations(
    int allowedOperationsLength, 
    vector<string> allowedOperations
){
    delete[] allowedHTTPOperations; 
    this->allowedHTTPOperations = new string[allowedOperationsLength];

    for(int i = 0; i < allowedOperations.size(); ++i)
    {
        this->allowedHTTPOperations[i] = allowedOperations[i];
    }
}

void ServerConnectionData::SetConnectionLocations(unordered_map<string, string> incommingLocations){
    this->connectionLocations = incommingLocations;
}

vector<string> ServerConnectionData::GetHTTPOperationValues(){
    vector<string> currentAllowedOperations;
    auto items = this->allowedHTTPOperations;

    for(int i = 0; i < items->length(); ++i)
    {
        items[i] = currentAllowedOperations[i];
    }

    return currentAllowedOperations;
}


unordered_map<string, string> ServerConnectionData::GetConnectionLocations(){
    return this->connectionLocations;
}

ServerConnectionData::~ServerConnectionData(){
    delete[] allowedHTTPOperations; 
}