/*
 GET THE WEB WORKER POOL TO WHERE IT CAN
 WORK WITH MORE THAN 1 CORE ON THE DEPLOYED 
 SYSTEM INCASE OF NEEDING TO SCALE VERTICALLY. 
 */
 const os = require("os");
 const NUMBER_OF_CORES_ON_MACHINE = 1; //os.cpus().length - 1;
 
 module.exports = {
   NUMBER_OF_CORES_ON_MACHINE,
 };
 
