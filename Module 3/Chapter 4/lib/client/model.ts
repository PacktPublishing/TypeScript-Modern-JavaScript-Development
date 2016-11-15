export interface Room {
	name: string;
	messages: Message[];
}
export interface Exception {
	title: string;
	content: string;
}

export class Message {
	id: number;
	user: string;
	content: string;
	isAuthor: boolean;
}

export function modify<U extends V, V>(old: U, changes: V) {
	const result: any = Object.create(Object.getPrototypeOf(old));
	for (const key of Object.keys(old)) {
		result[key] = old[key];
	}
	for (const key of Object.keys(changes)) {
		result[key] = changes[key];
	}
	return <U> result;
}
