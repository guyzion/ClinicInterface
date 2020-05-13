module.exports =  function isValidEntity(entity){
    if(entity[7] == "לא") return false;
    return true;
}