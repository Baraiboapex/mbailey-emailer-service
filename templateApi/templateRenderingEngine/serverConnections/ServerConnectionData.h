#include <string>
#include <unordered_map>

using namespace std;

#ifndef SERVER_CONNECTION_DATA
#define SERVER_CONNECTION_DATA

class ServerConnectionData{
    private:
        unordered_map<string, string> connectionLocations;
        string* allowedHTTPOperations;
    public:
        void SetAllowedHTTPOperations(int allowedOperationsLength, vector<string> allowedOperations);
        void SetConnectionLocations(unordered_map<string, string> incommingLocations);
        unordered_map<string, string> GetConnectionLocations();
        vector<string> GetHTTPOperationValues();
        ~ServerConnectionData();
};

#endif
