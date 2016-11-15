import { openWeatherMapKey, apiURL } from "./config";

export function getUrl(path: string) {
	let url = apiURL + path;
	if (path.indexOf("?") === -1) {
		url += "?";
	} else {
		url += "&";
	}
	url += "appid=" + openWeatherMapKey;
	return url;
}

export interface ForecastResponse {
	city: {
		name: string;
		country: string;
	};
	list: ForecastItem[];
}
export interface ForecastItem {
	dt: number;
	main: {
		temp: number
	};
	weather: {
		main: string,
		description: string
	};
}
