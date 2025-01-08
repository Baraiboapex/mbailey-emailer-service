#include "BaseHTMLDb.h"
#include <unordered_map>

using namespace std;

BaseHTMLDb::BaseHTMLDb(unordered_map<string, string> db) : db(db)
{
    db["valRep"]=R"(
        {'regex':'{{.*}}'}
    )";
    
    db["templateHeadline"]=R"(
        {
            'regex':'(\\<\\-\\[heading\\]\\-)(.*?)(\\-\\>)' 
            'repString':'<h1>{{$val}}</h1>'
        }
    )";
};

string BaseHTMLDb::GetHTMLDb(string keyToElement)
{
    return db[keyToElement];
};