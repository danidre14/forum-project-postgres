import validator from "validator";

export const parseQueryString = (string) => {
    if (typeof string !== "string") return undefined;
    const queryObject = {};
    const stringObject = string.replace("?", "").split("&");
    for (const i in stringObject) {
        const [key, value] = stringObject[i].split("=");
        queryObject[key] = value;
    }
    return queryObject;
}

export const parseQueryObject = (obj) => {
    if (typeof obj !== "object") return undefined;
    const stringObject = [];
    for (const i in obj) {
        stringObject.push(`${i}=${obj[i]}`);
    }
    const queryObject = stringObject.join("&");
    return queryObject;
}

export const Validator = {
    ...validator,
    isNumber(val) {
        return !isNaN(val);
    },
    isString(val) {
        return typeof val === "string";
    }
}

const utilities = {
    Validator,
    parseQueryString,
    parseQueryObject

}

// module.exports = utilities;

export default utilities;