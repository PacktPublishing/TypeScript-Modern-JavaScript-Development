import * as React from "react";
import * as model from "./model";

function Message(props: { message: model.Message }) {
	return (
		<div>
			<div className={
				props.message.isAuthor ? "message message-own" : "message"
			}>
				{ props.message.content }
				<div className="message-user">
					{ props.message.user }
				</div>
			</div>
			<div style={{clear: "both"}}></div>
		</div>
	);
}
export function Room(props: { room: model.Room, onPost: (content: string) => void }) {
	return (
		<div>
			<h2>{props.room.name}</h2>
			{props.room.messages.map(message => <Message key={message.id} message={message} />)}
			<InputBox onSubmit={content => props.onPost(content)} />
		</div>
	);
}
class InputBox extends React.Component<{ onSubmit(value: string): void; }, { value: string }> {
	state = {
		value: ""
	};
	render() {
		return (
			<form onSubmit={e => this.submit(e)}>
				<input onChange={e => this.changeValue((e.target as HTMLInputElement).value)} value={this.state.value} />
				<button disabled={this.state.value === ""} type="submit">Submit</button>
			</form>
		);
	}
	private changeValue(value: string) {
		this.setState({ value });
	}
	private submit(e: React.FormEvent<{}>) {
		e.preventDefault();
		if (this.state.value) {
			this.props.onSubmit(this.state.value);
			this.state.value = "";
		}
	}
}
