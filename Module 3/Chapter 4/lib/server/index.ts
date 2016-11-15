import * as WebSocket from "ws";
import * as api from "../shared/api";

const server = new WebSocket.Server({ port: 8800 });
server.on("connection", receiveConnection);

interface Session {
	sendChatMessage(message: api.ChatContent): void;
}
const sessions: Session[] = [];
const recentMessages: api.ChatContent[] = new Array(2048);
let recentMessagesPointer = 0;

function receiveConnection(ws: WebSocket) {
	let username: string;
	let room: string;
	
	ws.on("message", message);
	ws.on("close", close);
	const session: Session = { sendChatMessage };
	sessions.push(session);

	function message(data) {
		try {
			const object = <api.ClientMessage> JSON.parse(data);
			if (typeof object.kind !== "number") return;
			switch (object.kind) {
				case api.MessageKind.FindRooms:
					findRooms(<api.FindRooms> object);
				case api.MessageKind.OpenRoom:
					openRoom(<api.OpenRoom> object);
					break;
				case api.MessageKind.SendMessage:
					chatMessage(<api.SendMessage> object);
					break;
			}
		} catch (e) {
			console.error(e);
		}
	}
	function close() {
		const index = sessions.indexOf(session);
		sessions.splice(index, 1);
	}
	function send(data: api.ServerMessage) {
		ws.send(JSON.stringify(data));
	}
	
	function sendChatMessage(content: api.ChatContent) {
		if (content.room === room) {
			send({
				kind: api.MessageKind.ReceiveMessage,
				content
			});
		}
	}

	function chatMessage(message: api.SendMessage) {
		if (typeof message.content !== "string") return;

		const content: api.ChatContent = {
			room,
			username,
			content: message.content
		};

		recentMessages[recentMessagesPointer] = content;
		recentMessagesPointer++;
		if (recentMessagesPointer >= recentMessages.length) {
			recentMessagesPointer = 0;
		}

		for (const item of sessions) {
			if (session !== item) item.sendChatMessage(content);
		}
	}
	function openRoom(message: api.OpenRoom) {
		if (typeof message.username !== "string" || typeof message.room !== "string") return;
		username = message.username;
		room = message.room;
		function check(item: api.ChatContent) {
			if (!item) return false;
			return item.room === room;
		}
		let messages = [
			...recentMessages.slice(recentMessagesPointer).filter(check),
			...recentMessages.slice(0, recentMessagesPointer).filter(check)
		];
		send({
			kind: api.MessageKind.RoomContent,
			room,
			messages
		});
	}
	function findRooms(message: api.FindRooms) {
		const query = message.query;
		if (typeof query !== "string") return;

		const rooms = recentMessages
			.map(msg => msg.room)
			.filter(room => room.toLowerCase().indexOf(query.toLowerCase()) !== -1)
			.sort();
		const completions: string[] = [];
		let previous: string = undefined;
		for (let room of rooms) {
			if (previous !== room) {
				completions.push(room);
				previous = room;
			}
		}
		send({
			kind: api.MessageKind.RoomCompletions,
			completions
		});
	}
}
