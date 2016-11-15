import { Component, Output, EventEmitter } from "angular2/core";
import { Http, HTTP_PROVIDERS } from "angular2/http";
import { getUrl } from "./api";
import { LoginResult } from "../shared/api";

@Component({
	selector: "login-form",
	template: `
		<h2>Login</h2>
		<form (submit)="submit($event)">
			<div>{{ message }}</div>
			<label>Username<br /><input [(ngModel)]="username" /></label>
			<label>Password<br /><input type="password" [(ngModel)]="password" /></label>
			<button type="submit">Log in</button>
		</form>
		`,
	viewProviders: [HTTP_PROVIDERS]
})
export class LoginForm {
	username: string;
	password: string;
	message: string;

	constructor(private http: Http) {}

	submit(e: Event) {
		e.preventDefault();
		this.http.get(getUrl("login", { username: this.username, password: this.password }))
			.map(response => response.json())
			.subscribe((response: LoginResult) => {
				if (response.ok) {
					this.success.emit(undefined);
				} else {
					this.message = response.message;
				}
			});
	}

	@Output()
	success = new EventEmitter();
}
