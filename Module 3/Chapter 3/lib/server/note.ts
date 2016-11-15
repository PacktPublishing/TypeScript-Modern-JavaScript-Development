import { ServerRequest, ServerResponse, ServerError, StatusCode, validate } from "phaethon";
import { ObjectID } from "mongodb";
import { Session } from "./index";
import { getUserOrError } from "./user";
import { Note } from "./note";
import { getTitle } from "../shared/note";
import { MenuResult, ItemResult } from "../shared/api";
import * as database from "./database";

export interface Note {
	_id: ObjectID;
	userId: string;
	content: string;
}

export async function list(request: ServerRequest, session: Session): Promise<MenuResult> {
	const user = await getUserOrError(session);
	const results = await database.find(
		database.notes, { userId: user._id });
	const items = results.map(note => ({
		id: note._id.toHexString(),
		title: getTitle(note.content)
	}));
	return { items };
}
export async function find(request: ServerRequest, session: Session): Promise<ItemResult> {
	const user = await getUserOrError(session);
	const id = validate.expect(
		request.query["id"], validate.isString);
	const notes = await database.find(database.notes,
		{ _id: new ObjectID(id), userId: user._id });
	if (notes.length === 0) {
		throw new ServerError(StatusCode.ClientErrorNotFound);
	}
	const note = notes[0];
	return {
		id: note._id.toHexString(),
		content: note.content
	};
}

export async function insert(request: ServerRequest, session: Session): Promise<ItemResult> {
	const user = await getUserOrError(session);
	const content = validate.expect(
		request.query["content"], validate.isString);
	const note: Note = {
		_id: undefined,
		userId: user._id,
		content
	};
	await database.insert(database.notes, note);
	return {
		id: note._id.toHexString(),
		content: note.content
	};
}
export async function update(request: ServerRequest, session: Session): Promise<ItemResult> {
	const user = await getUserOrError(session);
	const id = validate.expect(
		request.query["id"], validate.isString);
	const content = validate.expect(
		request.query["content"], validate.isString);
	const note: Note = {
		_id: new ObjectID(id),
		userId: user._id,
		content
	};
	await database.update(database.notes,
		{ _id: new ObjectID(id), userId: user._id }, note);
	return {
		id: note._id.toHexString(),
		content: note.content
	};
}
export async function remove(request: ServerRequest, session: Session) {
	const user = await getUserOrError(session);
	const id = validate.expect(
		request.query["id"], validate.isString);
	await database.remove(database.notes,
		{ _id: new ObjectID(id), userId: user._id });
	return {};
}
