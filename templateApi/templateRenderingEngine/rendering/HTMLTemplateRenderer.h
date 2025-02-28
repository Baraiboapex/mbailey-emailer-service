#ifndef HTML_TEMPLATE_RENDERER
#define HTML_TEMPLATE_RENDERER

#include <unordered_map>
#include <string>
#include <regex>
#include <typeinfo>
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
            string replacedString = regex_replace(stringToReplace, regex(regexPattern), stringToLoad);
            return replacedString;
        }

    public:
        HTMLTemplateRenderer(Databases* database): databases(database) {}

        void BuildTemplate(HTMLInputType incommingData) {
            try{
                const auto currentDb = this->databases;
                auto& htmlElementDbTask = currentDb->GetTaskObject("HtmlGenerationDb");
                auto& htmlHeaderDbTask = currentDb->GetTaskObject("HtmlTemplateBaseDb");
                auto& jsonParserTask = currentDb->GetTaskObject("JSONParser");

                // Existing code
                auto htmlElementDbGet = dynamic_cast<HtmlGenerationDb*>(htmlElementDbTask.GetTask().get());
                auto htmlHeaderDbGet = dynamic_cast<HtmlTemplateBaseDb*>(htmlHeaderDbTask.GetTask().get());
                auto jsonParserTaskGet = dynamic_cast<JSONParser*>(jsonParserTask.GetTask().get());
                
                bool allDbGettersAreNotNull = htmlElementDbGet != nullptr && 
                htmlHeaderDbGet != nullptr &&
                jsonParserTaskGet != nullptr;

                // Check if the dynamic cast was successful
                if(allDbGettersAreNotNull) {
                    string templateHeadline = htmlElementDbGet->GetElementByTypeFromDb("templateHeaderInsertToken");
                    string emailDefaultHeader = htmlHeaderDbGet->GetHtmlTemplateHeader("emailDefaultHeader");
                    string emailDefaultFooter = htmlHeaderDbGet->GetHtmlTemplateHeader("emailDefaultFooter");
                    string valReplaceForTemplateReplaceIterator = htmlElementDbGet->GetElementByTypeFromDb("templateValueReplacementToken");

                    auto parsedBaseHTMLDataJsonHead = jsonParserTaskGet->ParseJSON(emailDefaultHeader);
                    auto parsedBaseHTMLHeadlineJson = jsonParserTaskGet->ParseJSON(templateHeadline);
                    auto parsedBaseHTMLFooterJson = jsonParserTaskGet->ParseJSON(emailDefaultFooter);
                    auto parsedJSONForTemplateIterator = jsonParserTaskGet->ParseJSON(valReplaceForTemplateReplaceIterator);
                    auto parsedDataJson = jsonParserTaskGet->ParseJSONArrayDataOnly(incommingData);

                    auto repHeaderStringIter = parsedBaseHTMLHeadlineJson.find("repString");
                    auto regexIter = parsedBaseHTMLHeadlineJson.find("regex");
                    auto templateHead = parsedBaseHTMLDataJsonHead.find("repString");
                    auto templateIterator = parsedJSONForTemplateIterator.find("regex");

                    this->finalRender = templateHead->second;
                    
                    for(const auto& element : parsedDataJson)
                    {
                        string elementToGet = element["elementName"].get<string>() + "InsertToken";
                        auto iteratorItem = jsonParserTaskGet->ParseJSON(htmlElementDbGet->GetElementByTypeFromDb(elementToGet));

                        this->finalRender += iteratorItem.find("repString")->second;

                        string loadedValue = "{{"+element["loadableValueName"].get<string>()+"}}";

                        string updatedRender = this->CreateRegexAndReplace(
                            templateIterator->second,
                            this->finalRender,
                            loadedValue
                        );

                        this->finalRender = updatedRender;

                        if(iteratorItem.find("regex") != iteratorItem.end()){
                            string updatedRender = this->CreateRegexAndReplace(
                                iteratorItem.find("regex")->second,
                                this->finalRender,
                                loadedValue
                            );

                            this->finalRender = updatedRender;
                        }
                    }

                    this->finalRender += parsedBaseHTMLFooterJson.find("repString")->second;
                } else {
                    cout << "dynamic_cast failed, baseElementDbGet is nullptr" << endl;
                }
            }catch(const runtime_error& e){
                cout << e.what() << endl;
            }
            
        }

        HTMLOutputType GetFinalRender() override {
            return this->finalRender;
        }
};

#endif
