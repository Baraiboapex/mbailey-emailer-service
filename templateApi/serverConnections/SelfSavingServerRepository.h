#include <string>
#include <tuple>

using namespace std;

#ifndef SELF_SAVING_SERVER_CONNECTOR
#define SELF_SAVING_SERVER_CONNECTOR

#include "./Interfaces/IServerConnector.h"
#include "./Interfaces/IFileStorageOperator.h"
#include "./ServerConnectionData.h"

class ServerConnectionVariables;
class ServerConnectionData;

class SelfSavingServerRepository: public IServerConnector, public IFileStorageOperator{
    private:
        ServerConnectionVariables connectionConfig;
        ServerConnectionData* connectionData;
    public:
        void SetupConnectionVariables(ServerConnectionVariables& serverConnection);
        bool ConnectToServer() override;
        bool DisconnectFromServer() override;
        bool SaveFile(string fileData, string fileLocation, string fileName);
        bool DeleteFile(string fileLocation, string fileName);
        bool UpdateFile(string fileData, string fileLocation, string fileName);
};

#endif