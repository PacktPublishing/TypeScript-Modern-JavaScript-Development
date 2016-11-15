export type Action<T> = (state: T) => T;
export type Dispatch<T> = (action: Action<T>) => void;

export function createStore<U>(state: U, onChange: (newState: U) => void) {
	const dispatch: Dispatch<U> = action => {
		state = action(state);
		onChange(state);
	}
	return dispatch;
}
