#include "HtmlElementDb.h"
#include <unordered_map>

#include "BaseHTMLDb.h"

using namespace std;

HtmlGenerationDb::HtmlGenerationDb(unordered_map<string, string> db) : BaseHTMLDb(db)
{
    db["dataGroups"]="{'regex':'(\\w)\\.\n', 'repString':'<p>{{$val}}</p>'}";
    db["templateMessage"]="{'regex':'(\\w)\\.\n', 'repString':'<p>{{$val}}</p>'}";
};

string HtmlGenerationDb::GetElementByTypeFromDb(string keyToElType)
{
    return GetHTMLDb(keyToElType);
}
