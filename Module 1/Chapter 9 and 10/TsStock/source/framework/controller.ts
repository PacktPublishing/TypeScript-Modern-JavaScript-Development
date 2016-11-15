/// <reference path="./interfaces"/>

import { EventEmitter } from "./event_emitter";
import { AppEvent } from "./app_event";

class Controller extends EventEmitter implements IController {

  constructor(metiator : IMediator) {
    super(metiator);
  }

  public initialize() : void {
    throw new Error('Controller.prototype.initialize() is abstract you must implement it!');
  }

  public dispose() : void {
    throw new Error('Controller.prototype.dispose() is abstract you must implement it!');
  }
}

export { Controller };
