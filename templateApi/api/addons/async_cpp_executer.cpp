#include <napi.h>

class MainFunctionWorker : public Napi::AsyncWorker {
public:
    MainFunctionWorker(Napi::Function& callback)
        : Napi::AsyncWorker(callback) {}

    void Execute() override {
        result = mainFunction();
    }

    void OnOK() override {
        Napi::HandleScope scope(Env());
        Callback().Call({Env().Null(), Napi::Number::New(Env(), result)});
    }

private:
    int result;
};

Napi::Value CallMainFunctionAsync(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Function callback = info[0].As<Napi::Function>();
    MainFunctionWorker* worker = new MainFunctionWorker(callback);
    worker->Queue();
    return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("callMainFunctionAsync", Napi::Function::New(env, CallMainFunctionAsync));
    return exports;
}

NODE_API_MODULE(addon, Init)