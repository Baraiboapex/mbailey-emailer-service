#include <fstream>

#include "./SelfSavingServerRepository.h"
#include "./ServerConnectionData.h"
#include "./globalVariables/HTTPConnectionTypes.h"

void SelfSavingServerRepository::SetupConnectionVariables(ServerConnectionVariables& serverConnection){
    this->connectionConfig = serverConnection;
}

bool SelfSavingServerRepository::ConnectToServer(){
    bool alreadyHasServerConnection = false;

    if(alreadyHasServerConnection){
        this->DisconnectFromServer();
    }

    this->connectionData = new ServerConnectionData();

    vector<string> allowedOperations = {"GET","POST","PUT","DELETE"};
    unordered_map<string, string> incommingLocations = {
        {"templates","../emailTemplates/"}
    };

    connectionData->SetAllowedHTTPOperations(4, allowedOperations);
    connectionData->SetConnectionLocations(incommingLocations);
    
    return true;
}

bool SelfSavingServerRepository::DisconnectFromServer(){
    this->connectionConfig.ClearConnectionVariables();

    delete this->connectionData;
    this->connectionData = nullptr;

    return true;
}   

bool SelfSavingServerRepository::SaveFile(string fileData, string fileLocation, string fileName){
    string fileSaveConnection = this->connectionConfig.GetSingleConnectionVariable(fileLocation);
    vector<string> allAllowedHTTPOperations = connectionData->GetHTTPOperationValues();
    const string POST_HTTP_OPERATION = HTTPConnectionTypes[0];

    bool canPostData = find(
        allAllowedHTTPOperations.begin(),
        allAllowedHTTPOperations.end(),
        POST_HTTP_OPERATION 
    ) != allAllowedHTTPOperations.end();

    if(canPostData){
        ofstream outFile(fileSaveConnection+fileName);

        outFile << fileData;
        outFile.close();
    }else{
        return false;
    }
}

bool SelfSavingServerRepository::DeleteFile(string fileLocation, string fileName){
    string fileSaveConnection = this->connectionConfig.GetSingleConnectionVariable(fileLocation);
    vector<string> allAllowedHTTPOperations = connectionData->GetHTTPOperationValues();
    const string DELETE_HTTP_OPERATION = HTTPConnectionTypes[3];

    bool canDeleteData = find(
        allAllowedHTTPOperations.begin(),
        allAllowedHTTPOperations.end(),
        DELETE_HTTP_OPERATION 
    ) != allAllowedHTTPOperations.end();

    if(canDeleteData){
        string fullFileLocation = fileSaveConnection+fileName;

        return remove(fullFileLocation.c_str()) == 0;
    }else{
        return false;
    }
}

bool SelfSavingServerRepository::UpdateFile(string fileData, string fileLocation, string fileName){
    string fileSaveConnection = this->connectionConfig.GetSingleConnectionVariable(fileLocation);
    vector<string> allAllowedHTTPOperations = connectionData->GetHTTPOperationValues();
    const string PUT_HTTP_OPERATION = HTTPConnectionTypes[3];

    bool canUpdateData = find(
        allAllowedHTTPOperations.begin(),
        allAllowedHTTPOperations.end(),
        PUT_HTTP_OPERATION 
    ) != allAllowedHTTPOperations.end();

    if(canUpdateData){
        ofstream outFile(fileSaveConnection+fileName);

        outFile << fileData;
        outFile.close();
    }else{
        return false;
    }
}