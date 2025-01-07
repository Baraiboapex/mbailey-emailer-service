#include <string>

using namespace std;

#ifndef TASK
#define TASK

template<typename TaskType>
class ITaskRouter{
    public:
        virtual TaskType GetTaskObject(string taskName);
        virtual void DestroyTasks();
};

#endif