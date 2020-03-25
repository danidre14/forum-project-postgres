import axios from "axios";

import { history } from "../../MyBrowserRouter";

async function makeRequest([link, method], options, success, error) {
	try {
		error = error ? error : () => console.log("Request Unsuccessful");
		const { data } = await axios[method || "get"](link || "/", options || {});

		// console.log("MakeRequest", { link, data, history });
		if (data.hardReroute && history.location.pathname !== data.hardReroute) {
			history.push(data.hardReroute || "/");
		} else {
			success(data);
		}
	} catch (e) {
		error(e);
		//console.trace(e.message);
	}
}

export default makeRequest;
