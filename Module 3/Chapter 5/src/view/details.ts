import { EventData } from "data/observable";
import { topmost } from "ui/frame";
import { Page } from "ui/page";
import { ActionBar, ActionItem } from "ui/action-bar";
import { Button } from "ui/button";
import { Label } from "ui/label";
import { StackLayout } from "ui/layouts/stack-layout";
import * as model from "../model";

export function createDetailsPage(scan: model.Scan, callback?: () => void) {
	return { createView };
	function createView() {
		const page = new Page();
		const layout = new StackLayout();
		page.content = layout;

		const label = new Label();
		label.text = scan.content;
		label.className = "details-content";
		layout.addChild(label);

		const date = new Label();
		date.text = scan.date.toLocaleString('en');
		layout.addChild(date);

		if (callback) {
			const button = new Button();
			button.text = "Open";
			button.on("tap", callback);
			layout.addChild(button);
		}

		return page;
	}
}
