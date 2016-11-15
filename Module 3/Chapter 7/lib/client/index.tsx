import * as React from "react";
import { render } from "react-dom";
import { createStore, Dispatch } from "../model/store";
import { State, empty } from "../model/state";
import { RenderSheet } from "./sheet";

class App extends React.Component<{}, State> {
	dispatch: Dispatch<State>;
	state = empty;

	constructor(props: {}) {
		super(props);
		this.dispatch = createStore(this.state, state => this.setState(state));
	}
	
	render() {
		return (
			<div className="sheet">
				<RenderSheet
					state={this.state}
					dispatch={this.dispatch} />
			</div>
		);
	}
}

render(<App />, document.getElementById("wrapper"));
