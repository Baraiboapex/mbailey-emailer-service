#include "HTMLTemplateRenderer.h"
#include "../../taskRouter/Task.cpp"
#include <string>
#include <regex>
using namespace std;

template <typename Databases, typename HTMLOutputType, typename HTMLInputType>
HTMLTemplateRenderer<Databases, HTMLOutputType, HTMLInputType>::HTMLTemplateRenderer(Databases database):database(database)
{
    this->database = database;
};

template <typename Databases, typename HTMLOutputType, typename HTMLInputType>
void HTMLTemplateRenderer<Databases, HTMLOutputType, HTMLInputType>::BuildTemplate(HTMLInputType incommingData)
{
    Databases currentDb = this->database;
    
    const Task baseElementDb = db["BaseHTMLDb"];
    const Task htmlElementDb = db["HtmlElementDb"];
    
    const unordered_map<string,string> parsedJson = currentDb["JSONParser"]->ParseJSON(incommingData);

    this->finalRender += currentDb["HtmlTemplateHeaderDb"]->db["emailDefaultHeader"];
    for(
        auto mapIterator = currentDb.begin(); 
        mapIterator != currentDb.end();
        ++mapIterator;
    ){
        if(parsedJson[mapIterator])
        {
            
        }
    }

    this->finalRender += currentDb["HtmlTemplateHeaderDb"]->db["emailDefaultFooter"];
    
};

template <typename Databases, typename HTMLOutputType, typename HTMLInputType>
HTMLOutputType HTMLTemplateRenderer<Databases, HTMLOutputType, HTMLInputType>::GetFinalRender()
{
    return this->finalRender;
};