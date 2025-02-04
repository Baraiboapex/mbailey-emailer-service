#include <string>

using namespace std;

#ifndef I_RENDERER
#define I_RENDERER

template <typename RendererReturnType, typename IncommingRendererDataType>
class IRenderer{
    public:
        virtual void BuildTemplate(IncommingRendererDataType incommingData);
        virtual RendererReturnType GetFinalRender();
};

#endif