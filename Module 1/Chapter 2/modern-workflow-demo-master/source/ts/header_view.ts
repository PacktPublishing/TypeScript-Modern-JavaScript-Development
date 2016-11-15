///<reference path="./references.d.ts" />

import View = require('./view');

var headerView = new View("./source/hbs/layout/header.hbs", "#header", null);

export = headerView;
