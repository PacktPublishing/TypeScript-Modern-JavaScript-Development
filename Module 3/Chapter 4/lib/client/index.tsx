import * as React from "react";
import * as ReactDOM from "react-dom";
import * as api from "../shared/api";
import * as model from "./model";
import { Menu } from "./menu";
import { Room } from "./room";

interface Props {
	apiUrl: string;
}
interface State {
	socket?: WebSocket;
	username?: string;
	connected?: boolean;
	completions?: string[];
	room?: model.Room;
}
class App extends React.Component<Props, State> {
	state = {
		socket: undefined,
		username: '',
		connected: false,
		completions: [],
		room: undefined
	};

	connect() {
		if (this.state.connected) return;

		const socket = new WebSocket(this.props.apiUrl);
		this.setState({ socket });

		socket.onopen = () => {
			this.setState({ connected: true });
			if (this.state.room) {
				this.openRoom(this.state.username, this.state.room.name);
			}
		};
		socket.onmessage = e => this.onMessage(e);
		socket.onclose = e => {
			this.setState({ connected: false });
			setTimeout(() => this.connect(), 400);
		};
	}
	onMessage(e: MessageEvent) {
		const message = JSON.parse(e.data.toString()) as api.ServerMessage;
		if (message.kind === api.MessageKind.RoomCompletions) {
			this.setState({
				completions: (message as api.RoomCompletions).completions
			});
		} else if (message.kind === api.MessageKind.RoomContent) {
			this.setState({
				room: {
					name: (message as api.RoomContent).room,
					messages: (message as api.RoomContent).messages.map(msg => this.mapMessage(msg))
				}
			});
		} else if (message.kind === api.MessageKind.ReceiveMessage) {
			this.addMessage(this.mapMessage((message as api.ReceiveMessage).content));
		}
	}

	componentDidMount() {
		this.connect();
	}

	render() {
		if (!this.state.connected) {
			return <div>Connecting...</div>;
		}
		if (this.state.room) {
			return <Room room={this.state.room} onPost={content => this.post(content)} />;
		}
		return <Menu
			completions={this.state.completions}
			onRequestCompletions={query => this.requestCompletions(query)}
			onClick={(username, room) => this.openRoom(username, room)}
		/>;
	}
	private send(message: api.ClientMessage) {
		this.state.socket.send(JSON.stringify(message));
	}
	private requestCompletions(query: string) {
		this.send({
			kind: api.MessageKind.FindRooms,
			query
		});
	}
	private openRoom(username, room: string) {
		this.send({
			kind: api.MessageKind.OpenRoom,
			username,
			room
		});
		this.setState({ username });
	}
	private nextMessageId: number = 0;
	private post(content: string) {
		this.send({
			kind: api.MessageKind.SendMessage,
			content
		});
		this.addMessage({
			id: this.nextMessageId++,
			user: this.state.username,
			content,
			isAuthor: true
		});
	}
	private addMessage(msg: model.Message) {
		const messages = [
			...this.state.room.messages,
			msg
		].slice(Math.max(0, this.state.room.messages.length - 10));
		const room = model.modify(this.state.room, {
			messages
		});
		this.setState({ room });
	}
	private mapMessage(msg: api.ChatContent) {
		return {
			id: this.nextMessageId++,
			user: msg.username,
			content: msg.content,
			isAuthor: msg.username === this.state.username
		};
	}
}
ReactDOM.render(
	<App apiUrl="ws://localhost:8800/" />,
	document.getElementById("app")
);
