#include <string>

using namespace std;

#ifndef BASE_ELEMENT_DB
#define BASE_ELEMENT_DB

template <typename RendererReturnType, typename IncommingRendererDataType>
class IRenderer{
    public:
        virtual void BuildTemplate(IncommingRendererDataType incommingData);
        virtual RendererReturnType GetFinalRender();
};

#endif