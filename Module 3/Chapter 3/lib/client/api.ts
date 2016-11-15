export const baseUrl = "/api/";
export function getUrl(method: string, query: { [key: string]: string }) {
	let url = baseUrl + method;
	let seperator = "?";
	for (const key of Object.keys(query)) {
		url += seperator + encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
		seperator = "&";
	}
	return url;
}
