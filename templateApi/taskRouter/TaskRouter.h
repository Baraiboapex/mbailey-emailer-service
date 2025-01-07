#include <unordered_map>
#include <string>

using namespace std;

#ifndef TASK_ROUTER
#define TASK_ROUTER

#include "interfaces/ITaskRouter.h"

template<typename TaskArray, typename TaskArrType>
class TaskRouter : public ITaskRouter<TaskArrType>{
    private:
         TaskArray tasks;
         unordered_map<string, TaskArrType> accessor;
    public:
        TaskRouter(TaskArray tasks);
        ~TaskRouter();
        TaskArrType GetTaskObject(string taskName) override ;
        void DestroyTasks() override;
};

#endif