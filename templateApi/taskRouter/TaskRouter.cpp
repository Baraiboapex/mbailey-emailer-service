#include <unordered_map>
#include <string>

#include "TaskRouter.h"

using namespace std;

template<typename TaskArray, typename TaskArrType>
TaskRouter<TaskArray, TaskArrType>::TaskRouter(TaskArray incommingTasks)
{
    this->tasks = incommingTasks;

    for(int i = 0; i <= this->tasks.size()-1; i++){
        this->accessor[TaskArrType->GetTaskName()] = *this->tasks[i];
    }
};

template<typename TaskArray, typename TaskArrType>
TaskRouter<TaskArray, TaskArrType>::~TaskRouter()
{
    this->DestroyTasks();
};

template<typename TaskArray, typename TaskArrType>
TaskArrType TaskRouter<TaskArray, TaskArrType>::GetTaskObject(string taskName)
{
    return this->tasks[taskName];
};

template<typename TaskArray, typename TaskArrType>
void TaskRouter<TaskArray, TaskArrType>::DestroyTasks()
{
    for(int i = 0; i <= this->tasks.size()-1; i++){
        delete this->accessor[TaskArrType->getTaskName()];
        *this->tasks[i] = nullptr;
    }

    delete *this->tasks;
    *this->tasks = nullptr;

    delete *this->accessor;
    *this->accessor = nullptr;
};



