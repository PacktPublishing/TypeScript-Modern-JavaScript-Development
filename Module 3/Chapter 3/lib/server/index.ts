import { Server, ServerRequest, ServerResponse, ServerError, StatusCode, SessionStore } from "phaethon";
import { ObjectID } from "mongodb";
import { User, login, logout } from "./user";
import * as note from "./note";

export interface Session {
	userId: ObjectID;
}

const server = new Server();
const sessionStore = new SessionStore<Session>("session-id", () => ({ userId: undefined }), 60 * 60 * 24, 1024);
server.listener = sessionStore.wrapListener(async (request, session) => {
	const response = await handleRequest(request, session.data);
	if (response instanceof ServerResponse) {
		return response;
	} else {
		const serverResponse = new ServerResponse(JSON.stringify(response));
		return serverResponse;
	}
});
server.listenHttp(8800);

async function handleRequest(request: ServerRequest, session: Session): Promise<ServerResponse | Object> {
	const path = request.path.toLowerCase();

	if (path === "/api/login")
		return login(request, session);
	if (path === "/api/logout")
		return logout(request, session);
	if (path === "/api/note/list")
		return note.list(request, session);
	if (path === "/api/note/insert")
		return note.insert(request, session);
	if (path === "/api/note/update")
		return note.update(request, session);
	if (path === "/api/note/remove")
		return note.remove(request, session);
	if (path === "/api/note/find")
		return note.find(request, session);
	throw new ServerError(StatusCode.ClientErrorNotFound);
}
