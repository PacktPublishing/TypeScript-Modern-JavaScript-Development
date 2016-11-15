export enum MessageKind {
	FindRooms,
	OpenRoom,
	SendMessage,

	RoomCompletions,
	ReceiveMessage,
	RoomContent
}
export interface Message {
	kind: MessageKind;
}

export type ClientMessage = OpenRoom | SendMessage | FindRooms;
export type ServerMessage = RoomContent | ReceiveMessage | RoomCompletions;

export interface OpenRoom extends Message {
	username: string;
	room: string;
}
export interface SendMessage extends Message {
	content: string;
}
export interface FindRooms extends Message {
	query: string;
}
export interface RoomCompletions extends Message {
	completions: string[];
}
export interface RoomContent extends Message {
	room: string;
	messages: ChatContent[];
}
export interface ReceiveMessage extends Message {
	content: ChatContent
}

export interface ChatContent {
	room: string;
	username: string;
	content: string;
}
