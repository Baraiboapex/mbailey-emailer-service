#include <unordered_map>
#include <string>

using namespace std;

#ifndef HTML_TEMPLATE_RENDERER
#define HTML_TEMPLATE_RENDERER

#include "./Interfaces/IRenderer.h"

template <typename Databases, typename HTMLOutputType, typename HTMLInputType>
class HTMLTemplateRenderer : public IRenderer<HTMLOutputType, HTMLInputType> {
    private:
        Databases databases;
        HTMLOutputType finalRender;
        //ADD SERVER CONNECTOR TYPE HERE 
        //WHEN YOU GET BACK!!!
        string CreateRegexAndReplace(
            string regexPattern,
            string stringToReplace,
            string stringToLoad
        );
    public:
        HTMLTemplateRenderer(Databases database) override;
        void BuildTemplate(HTMLInputType incommingData) override;
        HTMLOutputType GetFinalRender() override;
};

#endif