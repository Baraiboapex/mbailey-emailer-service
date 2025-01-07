#include <unordered_map>
#include <string>

using namespace std;

#ifndef HTML_TEMPLATE_BASE_DB
#define HTML_TEMPLATE_BASE_DB

#include "BaseHTMLDb.h"

class HtmlTemplateBaseDb : public BaseHTMLDb{
    public:
        HtmlTemplateBaseDb(unordered_map<string, string> db);
        string GetHtmlTemplateHeader(string keyToElement);
};

#endif