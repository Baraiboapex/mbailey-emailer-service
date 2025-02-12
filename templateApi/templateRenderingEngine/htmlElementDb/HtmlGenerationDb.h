#include <unordered_map>
#include <string>

using namespace std;

#ifndef HTML_GENERATION_DB
#define HTML_GENERATIOM_DB

#include "BaseHTMLDb.h"

class HtmlGenerationDb : public BaseHTMLDb
{
    public:
        HtmlGenerationDb(unordered_map<string, string> db) : BaseHTMLDb(db)
        {
            this->db["dataGroups"]="{'regex':'(\\w)\\.\n', 'repString':'<p>{{$val}}</p>'}";
        }
        string HtmlGenerationDb::GetElementByTypeFromDb(string keyToElType)
        {
            return GetHTMLDb(keyToElType);
        }
};

#endif
