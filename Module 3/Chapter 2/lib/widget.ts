import { Component } from "angular2/core";
import { Forecast } from "./forecast";
import { About } from "./about";

enum State {
	Today,
	Tomorrow,
	About
}

@Component({
	selector: "weather-widget",
	directives: [Forecast, About],
	template: `
		<input [(ngModel)]="location" (keyup.enter)="clickGo()" (blur)="clickGo()" />
		<button (click)="clickGo()">Go</button>
		
		<div class="tabs">
			<a href="javascript:;" [class.selected]="selectedTab === 0" (click)="selectTab(0)">Today</a>
			<a href="javascript:;" [class.selected]="selectedTab === 1" (click)="selectTab(1)">Tomorrow</a>
			<a href="javascript:;" [class.selected]="selectedTab === 2" (click)="selectTab(2)">About</a>
		</div>
		
		<div class="content" [class.is-dirty]="isDirty" *ngIf="selectedTab === 0 || selectedTab === 1">
			<weather-forecast [location]="activeLocation" [tomorrow]="selectedTab === 1" (correctLocation)="correctLocation($event)"></weather-forecast>
		</div>
		<div class="content" *ngIf="selectedTab === 2">
			<about-page [location]="activeLocation"></about-page>
		</div>
		`,
	styles: [
		`.tabs > a {
			display: inline-block;
			padding: 5px;
			margin-top: 5px;
			border: 1px solid #57BEDE;
			border-bottom: 0px none;
			text-decoration: none;
		}
		.tabs > a.selected {
			background-color: #57BEDE;
			color: #fff;
		}
		.content {
			border-top: 5px solid #57BEDE;
		}
		.is-dirty {
			opacity: 0.4;
			background-color: #ddd;
		}`
	]
})
export class Widget {
	constructor() {
		navigator.geolocation.getCurrentPosition(position => {
			const location = `Coordinate ${ position.coords.latitude } ${ position.coords.longitude }`;
			this.location = location;
			this.activeLocation = location;
		});
	}

	location: string = "Utrecht,NL";
	activeLocation: string = "Utrecht,NL";
	get isDirty() {
		return this.location !== this.activeLocation;
	}

	clickGo() {
		this.activeLocation = this.location;
	}
	correctLocation(location: string) {
		if (!this.isDirty) this.location = location;
		this.activeLocation = location;
	}

	selectedTab = 0;
	selectTab(index: number) {
		this.selectedTab = index;
	}
}
