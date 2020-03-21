module.exports = {
    Validator: {
        ...require("validator"),
        isNumber(val) {
            return !isNaN(val);
        },
        isString(val) {
            return typeof val === "string";
        }
    }
}