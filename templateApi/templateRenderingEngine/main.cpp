#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

// Ensure paths to headers are correct
#include "./taskRouter/interfaces/ITaskRouter.h"
#include "./taskRouter/interfaces/ITaskFunction.h"
#include "./htmlElementDb/BaseHTMLDb.h"
#include "./htmlElementDb/HtmlGenerationDb.h"
#include "./htmlElementDb/HtmlTemplateHeaderDb.h"
#include "./rendering/HTMLTemplateRenderer.h"
#include "./taskRouter/TaskRouter.h"
#include "./taskRouter/Task.h"
#include "./jsonParser/JSONParser.h"

using namespace std;

int main(int argc, char* argv[])
{   
    unordered_map<string, Task<shared_ptr<ITaskFunction>>> tasks;
    unordered_map<string, string> taskInitMap;

    // Initialize the tasks
    tasks["HtmlGenerationDb"] = Task<shared_ptr<ITaskFunction>>("HtmlGenerationDb", make_shared<HtmlGenerationDb>(taskInitMap));
    tasks["HtmlTemplateBaseDb"] = Task<shared_ptr<ITaskFunction>>("HtmlTemplateBaseDb", make_shared<HtmlTemplateBaseDb>(taskInitMap));
    tasks["JSONParser"] = Task<shared_ptr<ITaskFunction>>("JSONParser", make_shared<JSONParser>());

    // Ensure template parameters match exactly
    auto taskRouter = make_unique<TaskRouter<
        unordered_map<string, Task<shared_ptr<ITaskFunction>>>, 
        Task<shared_ptr<ITaskFunction>>
    >>(tasks);

    //Explicit scope defined here so that the 
    //unique and shared pointers are deleted
    //after said scope ends.
    {
        // Properly initialize the renderer
        using MyTaskRouter = TaskRouter<
            unordered_map<string, Task<shared_ptr<ITaskFunction>>>, 
            Task<shared_ptr<ITaskFunction>>
        >;
        HTMLTemplateRenderer<MyTaskRouter, string, string> templateRenderer(taskRouter.get());

        // Build the template
        templateRenderer.BuildTemplate(R"([
            {
                "elementName": "templateHeader",
                "loadableValueName": "heading"
            },
            {
                "elementName": "templateMessage",
                "loadableValueName": "emergencyMessage"
            },
            {
                "elementName": "templateMessage",
                "loadableValueName": "emergencyFollowupMessage"
            },
            {
                "elementName": "templateListItem",
                "loadableValueName": "item1"
            },
            {
                "elementName": "templateListItem",
                "loadableValueName": "item2"
            },
            {
                "elementName": "templateCheckbox",
                "loadableValueName": "isOk"
            },
            {
                "elementName": "templateCheckbox",
                "loadableValueName": "isNotOk"
            }
        ])");
        
        cout << templateRenderer.GetFinalRender() << endl;
    }
    
    return 0;
}
