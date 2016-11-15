import { Component, Input, Output, EventEmitter } from "angular2/core";
import { Http, Response, HTTP_PROVIDERS } from "angular2/http";
import { getUrl, ForecastResponse } from "./api";

interface ForecastData {
	date: string;
	temperature: number;
	main: string;
	description: string;
}

enum State {
	Loading,
	Refreshing,
	Loaded,
	Error
}

@Component({
	selector: "weather-forecast",
	viewProviders: [HTTP_PROVIDERS],
	template: `
		<span *ngIf="loading" class="state">Loading...</span>
		<span *ngIf="refreshing" class="state">Refreshing...</span>
		<a *ngIf="loaded || error" href="javascript:;" (click)="load()" class="state">Refresh</a>
		<h2>{{ tomorrow ? 'Tomorrow' : 'Today' }}'s weather in {{ location }}</h2>
		<div *ngIf="error">Failed to load data.</div>
		<ul>
			<li *ngFor="#item of data">
				<div class="item-date">{{ item.date }}</div>
				<div class="item-main">{{ item.main }}</div>
				<div class="item-description">{{ item.description }}</div>
				<div class="item-temperature">
					{{ item.temperature }} {{ temperatureUnit }}
				</div>
			</li>
		</ul>
		<div class="clearfix"></div>
		`,
	styles: [
		`.state {
			float: right;
			margin-top: 6px;
		}
		ul {
			margin: 0;
			padding: 0 0 15px;
			list-style: none;
			width: 100%;
			overflow-x: scroll;
			white-space: nowrap;
		}
		li {
			display: inline-block;
			margin-right: 15px;
			width: 170px;
			white-space: initial;
		}
		.item-date {
			font-size: 15pt;
			color: #165366;
			margin-right: 10px;
			display: inline-block;
		}
		.item-main {
			font-size: 15pt;
			display: inline-block;
		}
		.item-description {
			border-top: 1px solid #44A4C2;
			width: 100%;
			font-size: 11pt;
		}
		.item-temperature {
			font-size: 11pt;
		}`
	]
})
export class Forecast {
	constructor(private http: Http) {

	}

	temperatureUnit = "degrees Celsius";

	private _tomorrow = false;
	@Input()
	set tomorrow(value) {
		if (this._tomorrow === value) return;
		this._tomorrow = value;
		this.filterData();
	}
	get tomorrow() {
		return this._tomorrow;
	}

	private _location: string;
	@Input()
	set location(value) {
		if (this._location === value) return;
		this._location = value;
		this.state = State.Loading;
		this.data = [];
		this.load();
	}
	get location() {
		return this._location;
	}

	fullData: ForecastData[] = [];
	data: ForecastData[] = [];

	state = State.Loading;
	get loading() {
		return this.state === State.Loading;
	}
	get refreshing() {
		return this.state === State.Refreshing;
	}
	get loaded() {
		return this.state === State.Loaded;
	}
	get error() {
		return this.state === State.Error;
	}

	@Output()
	correctLocation = new EventEmitter<string>(true);

	private formatDate(date: Date) {
		return date.getHours() + ":" + date.getMinutes() + date.getSeconds();
	}
	private update(data: ForecastResponse) {
		if (!data.list) {
			this.showError();
			return;
		}

		const location = data.city.name + "," + data.city.country;
		if (this._location !== location) {
			this._location = location;
			this.correctLocation.emit(location);
		}

		this.fullData = data.list.map(item => ({
			date: this.formatDate(new Date(item.dt * 1000)),
			temperature: Math.round(item.main.temp - 273),
			main: item.weather[0].main,
			description: item.weather[0].description
		}));
		this.filterData();
		this.state = State.Loaded;
	}
	private showError() {
		this.data = [];
		this.state = State.Error;
	}
	private filterData() {
		const start = this.tomorrow ? 8 : 0;
		this.data = this.fullData.slice(start, start + 8);
	}

	private load() {
		let path = "forecast?mode=json&";
		const start = "coordinate ";
		if (this.location && this.location.substring(0, start.length).toLowerCase() === start) {
			const coordinate = this.location.split(" ");
			path += `lat=${ parseFloat(coordinate[1]) }&lon=${ parseFloat(coordinate[2]) }`;
		} else {
			path += "q=" + this.location;
		}

		this.state = this.state === State.Loaded ? State.Refreshing : State.Loading;
		this.http.get(getUrl(path))
			.map(response => response.json())
			.subscribe(res => this.update(<ForecastResponse> res), () => this.showError());
	}
}
