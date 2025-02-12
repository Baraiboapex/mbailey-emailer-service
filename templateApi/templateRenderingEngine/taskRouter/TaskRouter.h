template<typename TaskArray, typename TaskArrType>
class TaskRouter : public ITaskRouter<TaskArrType> {
private:
    TaskArray tasks;
public:
    TaskRouter(TaskArray incommingTasks) {
        this->tasks = incommingTasks;
    }

    TaskArrType GetTaskObject(string taskName) override {
        auto taskIt = this->tasks.find(taskName);
        if(taskIt != this->tasks.end()) {
            cout << "Found task: " << taskName << endl;
            return taskIt->second;
        } else {
            throw runtime_error("Task not found: " + taskName);
        }
    }
};
