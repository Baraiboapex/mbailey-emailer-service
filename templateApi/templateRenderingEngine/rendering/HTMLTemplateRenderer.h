#ifndef HTML_TEMPLATE_RENDERER
#define HTML_TEMPLATE_RENDERER

#include <unordered_map>
#include <string>
#include <regex>

#include "./Interfaces/IRenderer.h"

using namespace std;

template <typename Databases, typename HTMLOutputType, typename HTMLInputType>
class HTMLTemplateRenderer : public IRenderer<HTMLOutputType, HTMLInputType> {
    private:
        Databases* databases;
        HTMLOutputType finalRender;

        //ADD SERVER CONNECTOR TYPE HERE LATER
        string CreateRegexAndReplace(
            const string& regexPattern,
            const string& stringToReplace,
            const string& stringToLoad
        ) {
            return regex_replace(stringToReplace, regex(regexPattern), stringToLoad);
        }

    public:
        HTMLTemplateRenderer(Databases* database): databases(database) {}

        void BuildTemplate(HTMLInputType incommingData) {
            try{
                const auto currentDb = this->databases;
                auto& baseElementDb = currentDb->GetTaskObject("BaseHTMLDb");//dynamic_cast<BaseHTMLDb*>(&currentDb->GetTaskObject("BaseHTMLDb").GetTask());
                auto& htmlElementDbTask = currentDb->GetTaskObject("HtmlGenerationDb");//dynamic_cast<HtmlGenerationDb*>(&currentDb->GetTaskObject("HtmlGenerationDb").GetTask());
                auto& htmlHeaderDbTask = currentDb->GetTaskObject("HtmlTemplateBaseDb");//dynamic_cast<HtmlGenerationDb*>(&currentDb->GetTaskObject("HtmlGenerationDb").GetTask());
                auto& jsonParserTask = currentDb->GetTaskObject("JSONParser");//dynamic_cast<JSONParser*>(&currentDb->GetTaskObject("JSONParser").GetTask());
                
                #include <typeinfo> // Add this include

                // Existing code
                auto baseElementDbGet = dynamic_cast<BaseHTMLDb*>(baseElementDb.GetTask().get());
                auto htmlElementDbGet = dynamic_cast<HtmlGenerationDb*>(htmlElementDbTask.GetTask().get());
                auto htmlHeaderDbGet = dynamic_cast<HtmlTemplateBaseDb*>(htmlHeaderDbTask.GetTask().get());
                auto jsonParserTaskGet = dynamic_cast<JSONParser*>(jsonParserTask.GetTask().get());
                
                bool allDbGettersAreNotNull = baseElementDbGet != nullptr && htmlElementDbGet != nullptr && htmlHeaderDbGet != nullptr;
                // Check if the dynamic cast was successful
                if(allDbGettersAreNotNull) {
                    string valRep = baseElementDbGet->GetHTMLDb("valRep");
                    string dataGroups = htmlElementDbGet->GetElementByTypeFromDb("dataGroups");
                    string templateHeadline = baseElementDbGet->GetHTMLDb("templateHeadline");

                    // const string replacedHeader = this->CreateRegexAndReplace(
                    //     parsedBaseHTMLHeadlineJson.at("regex"), 
                    //     finalRender, 
                    //     parsedBaseHTMLHeadlineJson.at("repString")
                    // );
                } else {
                    cout << "dynamic_cast failed, baseElementDbGet is nullptr" << endl;
                }
    
                //const string temp = baseElementDb->GetHTMLDb("valRep");
                //const auto parsedBaseHTMLDataJson = jsonParserTask->ParseJSON(baseElementDb->GetHTMLDb("valRep"));
                // const auto parsedBaseHTMLHeadlineJson =jsonParserTask->ParseJSON(baseElementDb->GetHTMLDb("templateHeadline"));
                // const auto parsedHTMLElementJson = jsonParserTask->ParseJSON(htmlElementDb->GetElementByTypeFromDb("dataGroups"));

                // const auto htmlTemplateHeaderTask = dynamic_cast<HtmlTemplateBaseDb*>(&currentDb->GetTaskObject("HTMLTemplateHeaderDb").GetTask());
                // this->finalRender += htmlTemplateHeaderTask->GetHtmlTemplateHeader("emailDefaultHeader");

                // const string replacedHeader = this->CreateRegexAndReplace(
                //     parsedBaseHTMLHeadlineJson.at("regex"), 
                //     finalRender, 
                //     parsedBaseHTMLHeadlineJson.at("repString")
                // );
                
                // this->finalRender = replacedHeader;

                cout << this->finalRender << endl;
                // const string replacedHeaderText = this->CreateRegexAndReplace(
                //     parsedBaseHTMLDataJson.at("regex"), 
                //     finalRender, 
                //     parsedDataJson.at("customMessageHeaderValue")
                // );

                // this->finalRender = replacedHeaderText;

                // for (auto mapIterator = parsedDataJson.begin(); mapIterator != parsedDataJson.end(); ++mapIterator) {
                //     if (mapIterator != parsedDataJson.begin() && !mapIterator->second.empty()) {
                //         const string addedTemplateDataString = parsedHTMLElementJson.at("repString");
                //         this->finalRender += addedTemplateDataString;
                //         const string dataLoadingRegex = parsedHTMLElementJson.at("regex");
                //         const string replacedDataText = this->CreateRegexAndReplace(
                //             dataLoadingRegex, 
                //             finalRender, 
                //             mapIterator->second
                //         );
                //         this->finalRender = replacedDataText;
                //     }
                // }

                // this->finalRender += currentDb->GetTaskObject("HTMLTemplateHeaderDb").GetHtmlTemplateHeader("emailDefaultFooter");
            }catch(const runtime_error& e){
                cout << e.what() << endl;
            }
            
        }

        HTMLOutputType GetFinalRender() override {
            return this->finalRender;
        }
};

#endif
