module.exports = {
    isNumber(val) {
        return !isNaN(val);
    },
    isString(val) {
        return typeof val === "string";
    }
}