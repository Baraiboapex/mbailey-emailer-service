#include <string>
#include "Task.h"

using namespace std;

template<typename TaskType>
Task<TaskType>::Task(string &taskName, TaskType &taskType){
    this->taskName = taskName;
    this->task = taskType;
}

template<typename TaskType>
TaskType Task<TaskType>::GetTask(){
    return this->task;
}

template<typename TaskType>
string Task<TaskType>::GetTaskName(){
    return this->taskName;
}
