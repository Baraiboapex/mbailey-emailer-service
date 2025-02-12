#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

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

    tasks["BaseHTMLDb"] = Task<shared_ptr<ITaskFunction>>("BaseHTMLDb", make_shared<BaseHTMLDb>(taskInitMap));
    tasks["HtmlGenerationDb"] = Task<shared_ptr<ITaskFunction>>("HtmlGenerationDb", make_shared<HtmlGenerationDb>(taskInitMap));
    tasks["HtmlTemplateBaseDb"] = Task<shared_ptr<ITaskFunction>>("HtmlTemplateBaseDb", make_shared<HtmlTemplateBaseDb>(taskInitMap));
    tasks["JSONParser"] = Task<shared_ptr<ITaskFunction>>("JSONParser", make_shared<JSONParser>());

    auto taskRouter = make_unique<TaskRouter<
        unordered_map<string, Task<shared_ptr<ITaskFunction>>>, 
        Task<shared_ptr<ITaskFunction>>
    >>(tasks);

    auto templateRenderer = HTMLTemplateRenderer<
        TaskRouter<unordered_map<string, Task<shared_ptr<ITaskFunction>>>, Task<shared_ptr<ITaskFunction>>>,
        string,
        string
    >(taskRouter.get());

    templateRenderer.BuildTemplate("{\"customMessageHeaderValue\":\"Test, Test 1,2,3\",\"customMessageValue\":\"This here is a test\"}");
    
    cout << templateRenderer.GetFinalRender() << endl;
    cout << "I sharted!" << endl;

    return 0;
}
