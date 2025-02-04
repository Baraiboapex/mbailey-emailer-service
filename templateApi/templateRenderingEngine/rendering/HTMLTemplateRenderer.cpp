#include "HTMLTemplateRenderer.h"
#include "../../taskRouter/Task.cpp"
#include <string>
#include <regex>
using namespace std;

template <typename Databases, typename HTMLOutputType, typename HTMLInputType>
string HTMLTemplateRenderer<Databases, HTMLOutputType, HTMLInputType>::CreateRegexAndReplace(
    string regexPattern,
    string stringToReplace,
    string stringToLoad
)
{
    return regex_replace(stringToReplace, regexPattern, stringToLoad);
}

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
    
    const unordered_map<string,string> parsedDataJson = currentDb["JSONParser"]->ParseJSON(incommingData);
    const unordered_map<string,string> parsedBaseHTMLDataJson = currentDb["JSONParser"]->ParseJSON(baseElementDb["valRep"]);
    const unordered_map<string,string> parsedBaseHTMLHeadlineJson = currentDb["JSONParser"]->ParseJSON(baseElementDb["templateHeadline"]);
    const unordered_map<string,string> parsedHTMLElementJson = currentDb["JSONParser"]->ParseJSON(htmlElementDb["dataGroups"]);

    this->finalRender += currentDb["HtmlTemplateHeaderDb"]->db["emailDefaultHeader"];

    const string replacedHeader = this->CreateRegexAndReplace(
        parsedBaseHTMLHeadlineJson.at("regex"), 
        finalRender, 
        parsedBaseHTMLHeadlineJson.at("repString")
    );

    this->finalRender = replacedHeader;

    const string replacedHeaderText = this->CreateRegexAndReplace(
        parsedBaseHTMLDataJson.at("regex"), 
        finalRender, 
        parsedDataJson.at("customMessageHeaderValue")
    );

    for(
        auto mapIterator = parsedDataJson.begin(); 
        mapIterator != parsedDataJson.end();
        ++mapIterator;
    ){
        if(mapIterator != map.begin()){
            if(parsedDataJson[mapIterator])
            {
                const string addedTemplateDataString = parsedHTMLElementJson.at("repString");
                this->finalRender += addedTemplateData;
                const string dataLoadingRegex = parsedHTMLElementJson.at("regex");
                const string replacedDataText = this->CreateRegexAndReplace(
                    dataLoadingRegex, 
                    finalRender,
                    parsedDataJson[mapIterator->first]
                );
                this->finalRender = replacedDataText;
            }
        }
    }

    this->finalRender += currentDb["HtmlTemplateHeaderDb"]->db["emailDefaultFooter"];

};

template <typename Databases, typename HTMLOutputType, typename HTMLInputType>
HTMLOutputType HTMLTemplateRenderer<Databases, HTMLOutputType, HTMLInputType>::GetFinalRender()
{
    return this->finalRender;
};