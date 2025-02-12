#include <string>

using namespace std;

#ifndef TASK
#define TASK

template<typename TaskType>
class Task {
    private:
         string taskName;
         TaskType task;
    public:
        Task(){}
        Task(string taskName, TaskType taskType):taskName(taskName), task(taskType){
            this->taskName = taskName;
            this->task = taskType;
        }
        virtual ~Task() {}
        TaskType& GetTask(){
            return this->task;
        }
        string GetTaskName(){
            return this->taskName;
        }
};

#endif