import "zone.js/dist/zone.js";
import "rxjs";
import "reflect-metadata";
import "es6-shim";

import { Component } from "angular2/core";
import { bootstrap } from "angular2/platform/browser";
import { Http, HTTP_PROVIDERS, Response } from "angular2/http";
import { getUrl } from "./api";
import { MenuItem, MenuResult, ItemResult } from "../shared/api";
import { LoginForm } from "./login";
import { Menu } from "./menu";
import { NoteEditor } from "./note";

enum State {
	Login,
	Menu,
	Note,
	Error
}

@Component({
	selector: "note-application",
	viewProviders: [HTTP_PROVIDERS],
	directives: [LoginForm, Menu, NoteEditor],
	template: `
		<h1>My Notes</h1>
		<login-form *ngIf="stateLogin" (success)="loadMenu()"></login-form>
		<div *ngIf="!stateLogin">
			<a href="javascript:;" (click)="logout()">Log out</a>
		</div>
		<notes-menu *ngIf="stateMenu" [items]="menu" (create)="createNote()" (open)="loadNote($event)"></notes-menu>
		<note-editor *ngIf="stateNote && note" [content]="note.content" (save)="save($event)" (remove)="remove($event)"></note-editor>
		<div *ngIf="stateError">
			<h2>Something went wrong</h2>
			Reload the page and try again
		</div>
		`
})
class Application {
	state = State.Menu;

	constructor(private http: Http) {
		this.loadMenu();
	}

	get stateLogin() {
		return this.state === State.Login;
	}
	get stateMenu() {
		return this.state === State.Menu;
	}
	get stateNote() {
		return this.state === State.Note;
	}
	get stateError() {
		return this.state === State.Error;
	}

	menu: MenuItem[] = [];
	note: ItemResult = undefined;

	handleError(error: Response) {
		if (error.status === 401) {
			// Unauthorized
			this.state = State.Login;
			this.menu = [];
			this.note = undefined;
		} else {
			this.state = State.Error;
		}
	}
	loadMenu() {
		this.state = State.Menu;
		this.menu = [];
		this.http.get(getUrl("note/list", {})).subscribe(response => {
			const body = <MenuResult> response.json();
			this.menu = body.items;
		}, error => this.handleError(error));
	}
	createNote() {
		this.note = {
			id: undefined,
			content: ""
		};
		this.state = State.Note;
	}
	loadNote(id: string) {
		this.note = undefined;
		this.http.get(getUrl("note/find", { id: id })).subscribe(response => {
			this.state = State.Note;
			this.note = <ItemResult> response.json();
		}, error => this.handleError(error));
	}
	save(content: string) {
		let url: string;
		this.note.content = content;
		if (this.note.id === undefined) {
			// New note
			url = getUrl("note/insert", { content: this.note.content });
		} else {
			// Existing note
			url = getUrl("note/update", { id: this.note.id, content: this.note.content });
		}

		this.state = State.Note;
		this.note = undefined;
		this.http.get(url).subscribe(response => {
			this.loadMenu();
		}, error => this.handleError(error));
	}
	remove() {
		if (this.note.id === undefined) {
			this.loadMenu();
			return;
		}
		this.http.get(getUrl("note/remove", { id: this.note.id })).subscribe(response => {
			this.loadMenu();
		}, error => this.handleError(error));
	}
	logout() {
		this.http.get(getUrl("logout", {})).subscribe(response => {
			this.state = State.Login;
			this.menu = [];
			this.note = undefined;
		}, error => this.handleError(error));
	}
}

bootstrap(Application).catch(err => console.error(err));
