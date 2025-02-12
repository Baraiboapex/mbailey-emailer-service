const SenderQueue = require("../senderQueue");

const {
  templateCreatorWorker
} = require("./templateWorker");

const {
    isMainThread, workerData, parentPort
  } = require('node:worker_threads');

  if(!isMainThread){
    
    const pool = new SenderQueue();
    
    async function setupTemplateBuilderService(workerData){
        try{
          
          pool.addItemToQueue({
            taskName: workerData.taskName,
            taskProcess: templateCreatorWorker,
            taskData: workerData.templateTaskData,
            delayBetweenExecutions:5000
          });

          await pool.runQueueTasks();

          parentPort.postMessage("DONE");
        }catch(err){
          console.log("error in template builder : "+err);
        }
    }

    setupTemplateBuilderService(workerData);
  }