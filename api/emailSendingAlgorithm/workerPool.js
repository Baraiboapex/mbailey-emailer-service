const { AsyncResource } = require("node:async_hooks");
const { EventEmitter } = require("node:events");
const path = require("node:path");
const { Worker } = require("node:worker_threads");
const _ = require("lodash");

const kTaskInfo = Symbol("kTaskInfo");
const kWorkerFreedEvent = Symbol("kWorkerFreedEvent");

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super("WorkerPoolTaskInfo");
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy(); // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor({ numThreads }) {
    super();
    this.poolInUse = false;
    this.numThreads = numThreads;
    this.workers = [];
  }
  addNewWorker({ workerName, workerData }) {
    if (this.workers.length <= this.numThreads) {
      const worker = new Worker(path.resolve(__dirname, workerName + ".js"), {
        workerData: workerData !== undefined ? workerData : undefined,
      });
      worker.on("message", (result) => {
        // In case of success: Call the callback that was passed to `runTask`,
        // remove the `TaskInfo` associated with the Worker, and mark it as free
        // again.
        console.log("DOOONEE!");
        this.poolInUse = false;
        worker[kTaskInfo].done(null, result);
        worker[kTaskInfo] = null;
        this.emit("workerdone", result);
      });
      worker.on("error", (err) => {
        // In case of an uncaught exception: Call the callback that was passed to
        // `runTask` with the error.
        if (worker[kTaskInfo]) {
          worker[kTaskInfo].done(err, null);
        } else {
          console.log("ERROR IN POOL", err);
          this.emit("error", err);
          worker.terminate();
        }
        // Remove the worker from the list and start a new Worker to replace the
        // current one.
        this.workers.splice(this.workers.indexOf(worker), 1);
        this.poolInUse = false;
        this.addNewWorker({
          workerName,
          workerData,
        });
      });
      this.workers.push(worker);
      this.emit(kWorkerFreedEvent);
    } else {
      return;
    }
  }
  runTask(task, callback) {
    if (!this.poolInUse && this.workers.length <= this.numThreads) {
      if (this.workers.length === 0) {
        return;
      }

      this.poolInUse = true;
      const worker = this.workers.pop();
      worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
      worker.postMessage(task);
      console.log("POOL STARTED");
    } else {
      return;
    }
  }
  close() {
    console.log("POOL CLOSED");
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
  }
}

module.exports = WorkerPool;
