#include <string>

using namespace std;

#ifndef I_SERVER_CONNECTION
#define I_SERVER_CONNECTION

#include "ServerConnectionVariables.h"

class ServerConnectionVariables;

class IServerConnector{
    public:
        virtual void SetupConnectionVariables(ServerConnectionVariables& serverConnection);
        virtual bool ConnectToServer();
        virtual bool DisconnectFromServer();
};

#endif