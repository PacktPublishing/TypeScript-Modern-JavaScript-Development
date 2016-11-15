import * as crypto from "crypto";
import { ObjectID } from "mongodb";
import { ServerRequest, ServerResponse, ServerError, StatusCode, validate } from "phaethon";
import { Session } from "./index";
import { LoginResult } from "../shared/api";
import { users, find, insert } from "./database";

export interface User {
	_id: ObjectID;
	username: string;
	passwordHash: string;
}

function getPasswordHash(username: string, password: string): string {
	return crypto.createHash("sha256").update(password.length + "-" + username + "-" + password).digest("hex");
}

/* insert(users, {
	_id: undefined,
	username: "lorem",
	passwordHash: getPasswordHash("lorem", "ipsum")
});
insert(users, {
	_id: undefined,
	username: "foo",
	passwordHash: getPasswordHash("foo", "bar")
}); */

export async function login(request: ServerRequest, session: Session): Promise<LoginResult> {
	const username = validate.expect(
		request.query["username"], validate.isString);
	const password = validate.expect(
		request.query["password"], validate.isString);
	const passwordHash = getPasswordHash(username, password);

	const results = await find(users, { username, passwordHash });
	if (results.length === 0) {
		return { ok: false, message: "Username or password incorrect" };
	}
	const user = results[0];
	session.userId = user._id;
	return { ok: true };
}
export function logout(request: ServerRequest, session: Session): LoginResult {
	session.userId = undefined;
	return { ok: true };
}
export async function getUser(session: Session) {
	if (session.userId === undefined) return undefined;
	const results = await find(users, { _id: session.userId });
	return results[0];
}
export async function getUserOrError(session: Session) {
	const user = await getUser(session);
	if (user === undefined) {
		throw new ServerError(StatusCode.ClientErrorUnauthorized);
	}
	return user;
}
