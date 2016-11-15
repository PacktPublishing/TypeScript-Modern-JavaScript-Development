import { Page } from "ui/page";
import { ActionBar, ActionItem } from "ui/action-bar";
import { Label } from "ui/label";
import { ListView } from "ui/list-view";

export function createPage(itemCallback: (index: number) => void, scanCallback: () => void) {
	let items: string[] = [];
	let list: ListView;

	return { setItems, createView };
	
	function setItems(value: string[]) {
		items = value;
		if (list) {
			list.items = items;
			list.refresh();
		}
	}
	function createView() {
		const page = new Page();

		const actionBar = new ActionBar();
		actionBar.title = "QR Scanner";
		
		const buttonScan = new ActionItem();
		buttonScan.text = "Scan";
		buttonScan.on("tap", scanCallback);
		actionBar.actionItems.addItem(buttonScan);

		list = new ListView();
		list.items = items;
		list.on("itemLoading", args => {
			if (!args.view) {
				args.view = new Label();
			}
			(<Label> args.view).text = items[args.index];
		});
		list.on("itemTap", e => itemCallback(e.index));

		page.actionBar = actionBar;
		page.content = list;
		
		return page;
	}
}
