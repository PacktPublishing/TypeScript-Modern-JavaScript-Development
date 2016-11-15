export interface LoginResult {
	ok: boolean;
	message?: string;
}
export interface MenuResult {
	items: MenuItem[];
}
export interface MenuItem {
	id: string;
	title: string;
}
export interface ItemResult {
	id: string;
	content: string;
}
