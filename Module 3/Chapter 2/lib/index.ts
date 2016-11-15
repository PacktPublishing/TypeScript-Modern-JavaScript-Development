import "zone.js/dist/zone.js";
import "rxjs";
import "reflect-metadata";
import "es6-shim";

import { bootstrap } from "angular2/platform/browser";
import { Widget } from "./widget";

bootstrap(Widget).catch(err => console.error(err));
