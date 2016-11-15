import * as React from "react";
import { modify } from "./model";

interface MenuProps {
	completions: string[];
	onRequestCompletions: (room: string) => void;
	onClick: (username: string, room: string) => void;
}
interface MenuState {
	username?: string;
	roomname?: string;
}
export class Menu extends React.Component<MenuProps, MenuState> {
	state = {
		username: "",
		roomname: ""
	};
	render() {
		const menuEnabled = this.state.username !== "";
		const menuStyle = {
			opactity: menuEnabled ? 1 : 0.5
		};
		const showCreateButton = menuEnabled
			&& this.state.roomname !== ""
			&& this.props.completions
				.indexOf(this.state.roomname) === -1;
		
		return (<div>
			<label htmlFor="username">Username</label>
			<input type="text" id="username" onChange=
				{e => this.changeUsername(
					(e.target as HTMLInputElement).value)} />
			<div style={menuStyle}>
				<label htmlFor="roomname">Room</label>
				<input type="text" id="roomname"
					disabled={!menuEnabled}
					onChange={e =>
						this.changeName(
							(e.target as HTMLInputElement)
							.value)
						} />
				{ showCreateButton
					? <button onClick={
						() => this.submit(this.state.roomname)}>
						Create room { this.state.roomname }</button>
					: "" }
				{ this.props.completions.map(
					completion =>
						<a href="javascript:;"
							key={completion}
							style={{display: "block"}}
							onClick={() =>
								this.submit(completion)}>
							{ completion }</a>) }
			</div>
		</div>);
	}
	private changeUsername(username: string) {
		this.setState({ username });
	}
	private changeName(roomname: string) {
		this.setState({ roomname });
		this.props.onRequestCompletions(roomname);
	}
	private submit(room: string) {
		this.props.onClick(this.state.username, room);
	}
}
