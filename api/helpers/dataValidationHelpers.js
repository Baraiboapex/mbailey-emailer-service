    /* what the array will look like for this:
        const validators = [
            {
                fieldName:"fieldName",
                validatorFunction:(val)=>{
                    const fieldValidatorGoesHere = null;
                    return fieldValidatorGoesHere;
                }
            },
        ]
    */
function validateObjectFields({objectToValidate, fieldsToValidate}){
    const totalAmountOfFieldsToValidate = Object.keys(objectToValidate).length;
    const fieldsThatAreNotValid = [];
    let validatedFields = 0;

    fieldsToValidate.forEach(fieldValidator=>{
        const currentObjectFieldValue = objectToValidate[fieldValidator.fieldName];
        const checkIfFieldIsValid = fieldValidator.validatorFunction(currentObjectFieldValue);
        if(checkIfFieldIsValid){
            validatedFields++;
        }else{
            fieldsThatAreNotValid.push(fieldValidator.fieldName);
        }
    });

    let allFieldsAreValid = validatedFields >= totalAmountOfFieldsToValidate;

    return {
        allFieldsAreValid,
        invalidFields:fieldsThatAreNotValid.length > 0 ? fieldsThatAreNotValid.join(",") : ""
    };
}

module.exports ={
    validateObjectFields
}