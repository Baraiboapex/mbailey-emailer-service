using namespace std;

#ifndef BASE_ELEMENT_DB
#define BASE_ELEMENT_DB

#include <unordered_map>
#include <string>
#include "../taskRouter/interfaces/ITaskFunction.h"

class BaseHTMLDb : public ITaskFunction {
    protected:
         unordered_map<string, string> db;
    public:
        BaseHTMLDb(unordered_map<string, string> initDb) : db(initDb)
        {
            this->db["valRep"]=R"(
                {'regex':'{{.*}}'}
            )";
            
            this->db["templateHeadline"]=R"(
                {
                    'regex':'(\\<\\-\\heading\\\\-)(.*?)(\\-\\>)' 
                    'repString':'<h1>{{$val}}</h1>'
                }
            )";
        }

        string GetHTMLDb(string keyToElement)
        {
            return db[keyToElement];
        }

        void Execute(){
            return;
        }
};
#endif