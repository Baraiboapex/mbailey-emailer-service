const DoublyLinkedList = require("../helpers/dataStructs/doublyLinkedList");

class SenderQueue {
  itemList = new DoublyLinkedList();
  queueInUse = false;
  addItemToQueue({ taskName, taskProcess, taskData, delayBetweenExecutions }) {
      if(!this.queueInUse){
        this.itemList.push({
          taskName,
          taskProcess,
          taskData,
          delayBetweenExecutions
        });
      }else{
        return;
      }
  }
  removeItemFromQueue() {
    this.itemList.shift();
    return this.itemList.getHeadNode();
  }
  clearQueue(){
    this.itemList = new DoublyLinkedList();
  }
  pauseQueue(queueExecutionDelayInterval){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        },queueExecutionDelayInterval);
    });
  }
  async runQueueTasks() {
    return new Promise(async (resolve, reject) => {
      let currentTask = this.itemList.getHeadNode();
      while (currentTask) {
        try {
          if(currentTask.data.taskData.delayBetweenExecutions){
            await this.pauseQueue(currentTask.data.taskData.delayBetweenExecutions);
          }
          await currentTask.data.taskProcess(currentTask.data.taskData);
          this.queueInUse = false;
          currentTask = currentTask.next;
          this.removeItemFromQueue();
        } catch (err) {
          reject(err + " Task could not be completed. ");
          break;
        }
      }

      resolve();
    });
  }
}

module.exports = SenderQueue;
