#ifndef I_TASK_FUNCTION
#define I_TASK_FUNCTION

class ITaskFunction {
public:
    virtual void Execute() = 0;
    virtual ~ITaskFunction() = default; // Ensure the class is polymorphic
};

#endif
