/// <reference path="./interfaces"/>

import { EventEmitter } from "./event_emitter";
import { AppEvent } from "./app_event";

class Dispatcher extends EventEmitter implements IDispatcher {
  private _controllersHashMap : Object;
  private _currentController : IController;
  private _currentControllerName : string;

  constructor(metiator : IMediator, controllers : IControllerDetails[]) {
    super(metiator);
    this._controllersHashMap = this.getController(controllers);
    this._currentController = null;
    this._currentControllerName = null;
  }

  // listen to app.dispatch events
  public initialize() {
    this.subscribeToEvents([
      new AppEvent("app.dispatch", null, (e: any, data? : any) => {
        this.dispatch(data);
      })
    ]);
  }

  // Creates a hash map using the controller name as key and the constructor as value
  private getController(controllers : IControllerDetails[]) : Object {
    var hashMap, hashMapEntry, name, controller, l;

    hashMap = {};
    l = controllers.length;

    if(l <= 0) {
      this.triggerEvent(new AppEvent(
        "app.error",
        "Cannot create an application without at least one contoller.",
        null));
    }

    for(var i = 0; i < l; i++) {
      controller = controllers[i];
      name = controller.controllerName;
      hashMapEntry = hashMap[name];
      if(hashMapEntry !== null && hashMapEntry !== undefined) {
        this.triggerEvent(new AppEvent(
          "app.error",
          "Two controller cannot use the same name.",
          null));
      }
      hashMap[name] = controller.controller;
    }
    return hashMap;
  }

  // Create and dispose controller instances
  private dispatch(route : IRoute) {
    var Controller = this._controllersHashMap[route.controllerName];

    // try to find controller
    if (Controller === null || Controller === undefined) {
      this.triggerEvent(new AppEvent(
        "app.error",
        `Controller not found: ${route.controllerName}`,
        null));
    }
    else {
      // create a controller instance
      var controller : IController = new Controller(this._metiator);

      // action is not available
      var a = controller[route.actionName];
      if (a === null || a === undefined) {
        this.triggerEvent(new AppEvent(
          "app.error",
          `Action not found in controller: ${route.controllerName} -  + ${route.actionName}`,
          null));
      }
      // action is available
      else {
        if(this._currentController == null) {
          // initialize controller
          this._currentControllerName = route.controllerName;
          this._currentController = controller;
          this._currentController.initialize();
        }
        else {
          // dispose previous controller if not needed
          if(this._currentControllerName !== route.controllerName) {
            this._currentController.dispose();
            this._currentControllerName = route.controllerName;
            this._currentController = controller;
            this._currentController.initialize();
          }
        }
        // pass flow from dispatcher to the controller
        this.triggerEvent(new AppEvent(
          `app.controller.${this._currentControllerName}.${route.actionName}`,
          route.args,
          null
        ));
      }
    }
  }
}

export { Dispatcher };
