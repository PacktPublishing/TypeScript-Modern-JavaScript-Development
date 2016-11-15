import { getTitle } from "../shared/note";
import { Component, Input, Output, EventEmitter } from "angular2/core";

@Component({
	selector: "note-editor",
	template: `
		<button (click)="saveNote()">Save</button>
		<button (click)="deleteNote()">Delete</button>
		<br />
		<h2>{{ title }}</h2>
		<textarea [(ngModel)]="content"></textarea>
		`,
	styles: [
		`textarea { width: 100%; height: 400px;`
	]
})
export class NoteEditor {
	@Input()
	content: string;

	@Output()
	save = new EventEmitter<string>();

	@Output()
	remove = new EventEmitter();

	saveNote() {
		this.save.emit(this.content);
	}
	deleteNote() {
		this.remove.emit(undefined);
	}

	get title() {
		return getTitle(this.content);
	}
}
