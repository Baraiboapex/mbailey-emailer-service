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
        Task(string &taskName, TaskType &taskType);
        TaskType GetTask();
        string GetTaskName();
};

#endif