function tryParsingJson(jsonString){
    try{
        return JSON.parse(jsonString);
    }catch{
        return null;
    }
}

const jsonHelpers={
    tryParsingJson
};

export default jsonHelpers;