const chokidar = require('chokidar');
const fs = require('fs');
const moment = require('moment');
const isValidEntity = require('./validators');

const fields = ['Num_Avi', 'Emer_Dept_hmo_GK', 'Status_Clinic', 'Status_Pharmacy', 'Status_Family_Doctor', 'Status_Nurse', 'Status_Pediatrician', 'Status_Gynecologist']
const dirPath = 'ex-files'

const watcher = chokidar.watch(dirPath, { persistent: true });
watcher.on('add', newFileListener);

function newFileListener(path) {
    console.log(`New file was added: ${path}\n`)
    let entityArr = readNewFile(path);

    let invalidEntities = entityArr.filter(entity => !isValidEntity(entity));
    console.log(`Found ${invalidEntities.length} invalid entities:`);
    invalidEntities.forEach((entity) => console.log(entity));

    entityArr = entityArr.filter(entity => isValidEntity(entity));
    if(entityArr === []){
         console.log("No valid entities");
         return;
    }

    let jsonArr = entityArr.map(entity => buildJson(entity));
    sendToDP(jsonArr);

    fs.unlinkSync(path); // delete the file 
    console.log(`File deleted`)
}  

function readNewFile(path) {
    let file =  fs.readFileSync(path, 'utf8');
    console.log(`File data:\n${file}\n`);
    let lines =  file.split('\r\n')
    return lines.map(line => line.split(';'));
}

function buildJson(entity) {
    let json = {};
    json.Time_stamp = parseToISOString(entity[0], entity[1]);
    entity.splice(0, 2);
    fields.forEach((field, index) => json[field] = entity[index]);
    return json;
} 

function parseToISOString(date, time){
    let fullDate = date + ' ' + time;
    let dateObj = moment(fullDate, "DD/MM/YYYY HH:mm");
    return dateObj.toISOString();
}

function sendToDP(jsonArr){
	console.log(`\nResult message:\n`);
	console.log(jsonArr);
    console.log('Data sent')
}

