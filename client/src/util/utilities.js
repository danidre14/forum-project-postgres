import validator from "validator";
const utilities = {
    Validator: {
        ...validator,
        isNumber(val) {
            return !isNaN(val);
        },
        isString(val) {
            return typeof val === "string";
        }
    }

}

// module.exports = utilities;

export default utilities;