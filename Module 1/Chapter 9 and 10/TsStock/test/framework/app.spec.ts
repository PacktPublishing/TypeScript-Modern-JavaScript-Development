///<reference path="../../typings/tsd.d.ts" />

import { App } from "../../source/framework/app";
import { View } from "../../source/framework/view";
import { Controller } from "../../source/framework/controller";

var expect = chai.expect;

describe("App class spec \n", () => {

  it('It should set its own properties correctly \n', () => {

   var appSettings : IAppSettings = {
     defaultController : "home",
     defaultAction : "index",
     layout : new View(),
     controllers : new Array<IController>()
   };

    var app = new App();
    expect(app.start).to.be.a('function');
  });
});
