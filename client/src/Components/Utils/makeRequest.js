import axios from "axios";

async function makeRequest([link, method], options, success, error) {
	try {
		error = error ? error : () => console.log("Request Unsuccessful");
		const { data } = await axios[method || "get"](link || "/", options || {});

		//console.log("MakeRequest", { link, data });
		success(data);
	} catch (e) {
		error(e);
		//console.trace(e.message);
	}
}

export default makeRequest;
