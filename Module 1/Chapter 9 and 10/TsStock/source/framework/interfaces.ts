/// <reference path="../../typings/tsd.d.ts"/>

interface IControllerDetails {
  controllerName : string;
  controller : { new(...args : any[]): IController ;};
}

interface IAppSettings {
  isDebug : boolean,
  defaultController : string;
  defaultAction : string;
  controllers : Array<IControllerDetails>;
  onErrorHandler : (o : Object) => void;
}

interface IAppEvent {
  topic : string;
  data : any;
  handler: (e: any, data : any) => void;
}

interface IMediator {
  publish(e : IAppEvent) : void;
  subscribe(e : IAppEvent) : void;
  unsubscribe(e : IAppEvent) : void;
}

interface IRoute {
  controllerName : string;
  actionName : string;
  args : Object[];
  serialize() : string;
}

interface IRouter extends IEventEmitter {
  initialize() : void;
}

interface IDispatcher extends IEventEmitter {
  initialize() : void;
}

interface IEventEmitter {
  triggerEvent(event : IAppEvent);
  subscribeToEvents(events : Array<IAppEvent>);
  unsubscribeToEvents(events : Array<IAppEvent>);
}

interface IController extends IEventEmitter {
  initialize() : void;
  dispose() : void;
}

interface IModel extends IEventEmitter {
  initialize() : void;
  dispose() : void;
}

interface IView extends IEventEmitter {
  initialize() : void;
  dispose() : void;
}
