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
            this->db["templateValueReplacementToken"] = R"({"regex": "\\{\\{\\$val\\}\\}"})";
            this->db["templateHeaderInsertToken"] = R"({"repString": "<h1>{{$val}}</h1><hr/>"})";
            this->db["templateCheckboxInsertToken"] = R"({"regex": "\\{\\{\\&templateCheckbox\\}\\}", "repString": "<label for=\"{{&templateCheckbox}}\">{{&templateCheckbox}}</label><input type=\"checkbox\" name=\"{{&templateCheckbox}}\"/>"})";
            this->db["templateListItemInsertToken"] = R"({"repString": "<span>&#x2022;{{$val}}</span>"})";
            this->db["templateMessageInsertToken"] = R"({"repString": "<p>{{$val}}</p>"})";
        }
        string HtmlGenerationDb::GetElementByTypeFromDb(string keyToElType)
        {
            return GetHTMLDb(keyToElType);
        }
};

#endif
