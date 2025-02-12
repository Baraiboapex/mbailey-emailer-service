#include <string>

using namespace std;

#ifndef I_TASK_ROUTER
#define I_TASK_ROUTER

template<typename TaskType>
class ITaskRouter{
    public:
        virtual TaskType GetTaskObject(string taskName) = 0;
};

#endif