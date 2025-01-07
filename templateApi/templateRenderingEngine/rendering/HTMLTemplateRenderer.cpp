#include "HTMLTemplateRenderer.h"
#include "../../taskRouter/Task.cpp"
#include <string>

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
    
    this->finalRender += currentDb["HtmlTemplateHeaderDb"]->db["emailDefaultHeader"];

    const Task htmlTemplateHeaderDb = db["BaseHTMLDb"]->db[""];
    const Task htmlElementDb = db["HtmlElementDb"]->;

    for(
        auto mapIterator = currentDb.begin(); 
        mapIterator != currentDb.end();
        ++mapIterator;
    ){
        
    }

    this->finalRender += currentDb["HtmlTemplateHeaderDb"]->db["emailDefaultFooter"];
    
};

template <typename Databases, typename HTMLOutputType, typename HTMLInputType>
HTMLOutputType HTMLTemplateRenderer<Databases, HTMLOutputType, HTMLInputType>::GetFinalRender()
{
    return this->finalRender;
};