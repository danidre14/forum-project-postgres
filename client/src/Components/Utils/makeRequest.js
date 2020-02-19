import axios from "axios";

async function makeRequest([link, method], options, success, error) {
    try {
        error = error ? error : () => console.log("Request Unsuccessful");
        const request = await axios[method || "get"](link || "/", options || {});
        const requestOK = request && request.status === 200 && request.statusText === 'OK';
        if (!requestOK) {
            error(`Status: ${status}`);
            return console.log("Error:", status, { data });
        }
        const data = await request.data;

        success(data);
    } catch (e) {
        error(e.message);
        console.log(e.message);
    }
}

export default makeRequest;