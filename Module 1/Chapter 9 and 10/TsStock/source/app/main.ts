/// <reference path="../framework/interfaces"/>

import { App, View } from "../framework/framework";
import { MarketController } from "./controllers/market_controller";
import { SymbolController } from "./controllers/symbol_controller";

var appSettings : IAppSettings = {
  isDebug : true,
  defaultController : "market",
  defaultAction : "nasdaq",
  controllers : [
    { controllerName : "market", controller : MarketController },
    { controllerName : "symbol", controller : SymbolController }
  ],
  onErrorHandler : function(e : Object) {
    alert("Sorry! there has been an error please check out the console for more info!");
    console.log(e.toString());
  }
};

var myApp = new App(appSettings);

// run app
myApp.initialize();
