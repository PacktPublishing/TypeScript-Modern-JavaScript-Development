import * as application from "application";
import * as applicationSettings from "application-settings";
import * as barcodescanner from "nativescript-barcodescanner";
import * as dialogs from "ui/dialogs";
import { topmost } from "ui/frame";
import { Page } from "ui/page";
import { Label } from "ui/label";
import { openUrl } from "utils/utils";
import { createPage } from "./view/main";
import { createDetailsPage } from "./view/details";
import * as model from "./model";

let items: model.Scan[] = [];

const page = createPage(index => showDetailsPage(items[index]), scan);
application.mainEntry = page.createView;
application.cssFile = "style.css";
load();
update();
application.start();

function scan() {
	barcodescanner.scan().then(result => {
		addItem(result.text);
		return false;
	}, () => {
		return dialogs.confirm("Failed to scan a barcode. Try again?")
	}).then(tryAgain => {
		if (tryAgain) {
			scan();
		}
	});
}
function addItem(content: string) {
	const item: model.Scan = {
		content,
		date: new Date()
	};
	items = [item, ...items].slice(0, 100);
	save();
	update();
	showDetailsPage(item);
}
function showDetailsPage(scan: model.Scan) {
	let callback: () => void;
	if (model.isUrl(scan)) {
		callback = () => openUrl(scan.content);
	}
	topmost().navigate(createDetailsPage(scan, callback).createView);
}

function update() {
	page.setItems(items.map(item => item.content));
}
function save() {
	applicationSettings.setString("items", JSON.stringify(items));
	update();
}
function load() {
	const data = applicationSettings.getString("items");
	if (data) {
		try {
			items = (<any[]> JSON.parse(data)).map(item => ({
				content: item.content,
				date: new Date(item.date)
			}));
		} catch (e) {}
	}
}
