#include <unordered_map>
#include <string>

using namespace std;

#ifndef HTML_ELEMENT_DB
#define HTML_ELEMENT_DB

#include "BaseHTMLDb.h"

class HtmlGenerationDb : public BaseHTMLDb
{
    public:
        HtmlGenerationDb(unordered_map<string, string> db);
        string GetElementByTypeFromDb(string keyToElType);
};

#endif
