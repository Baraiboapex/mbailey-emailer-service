#include <string>

using namespace std;

#ifndef I_FILE_STORAGE_OPERATOR
#define I_FILE_STORAGE_OPERATOR

class IFileStorageOperator{
    public:
        virtual bool SaveFile(string fileData, string fileLocation, string fileName);
        virtual bool DeleteFile(string fileLocation, string fileName);
        virtual bool UpdateFile(string fileData, string fileLocation, string fileName);
};

#endif