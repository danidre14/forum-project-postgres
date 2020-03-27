import axios from "axios";

import { history } from "../../MyBrowserRouter";

function makeRequest() {
	const source = axios.CancelToken.source();
	const request = async ([link, method], options, success, error) => {
		try {
			error = error ? error : () => console.log(`Request to ${link} was unsuccessful`);
			// const { data } = await axios[method || "get"](link || "/", options || {});
			const { data } = await axios({
				method: (method || "get"),
				url: (link || "/"),
				data: (options || {}),
				cancelToken: source.token,
			});

			// console.log("MakeRequest", { link, data, history });
			if (data.hardReroute && history.location.pathname !== data.hardReroute) {
				history.push(data.hardReroute || "/");
			} else {
				success(data);
			}
		} catch (e) {
			if (!axios.isCancel(e))
				error(e);
			console.log("Err try", e, e.message);
		}
	}
	const cancel = () => {
		source.cancel();
	}

	return { request, cancel };
}

export default makeRequest;
