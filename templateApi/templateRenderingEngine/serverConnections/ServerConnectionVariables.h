#include <string>
#include <unordered_map>

using namespace std;

#ifndef SERVER_CONNECTION_VARIABLES
#define SERVER_CONNECTION_VARIABLES

class ServerConnectionVariables{
    private:
        unordered_map<string, string> connectionConfig;
    public:
        ServerConnectionVariables(unordered_map<string, string>& incommingConfigVariables);
        void AddConnectionVariable(string key, string value);
        void ClearConnectionVariables();
        unordered_map<string, string> GetAllConnectionVariables();
        string GetSingleConnectionVariable(string keyToGet);
};

#endif