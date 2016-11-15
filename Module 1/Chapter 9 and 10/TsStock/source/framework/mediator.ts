/// <reference path="./interfaces"/>

class Mediator implements IMediator {
  private _$ : JQuery;
  private _isDebug;

  constructor(isDebug : boolean = false) {
    this._$ = $({});
    this._isDebug = isDebug;
  }

  public publish(e : IAppEvent) : void {
    if(this._isDebug === true) { console.log(new Date().getTime(), "PUBLISH", e.topic, e.data); }
    this._$.trigger(e.topic, e.data);
  }

  public subscribe(e : IAppEvent) : void {
    if(this._isDebug === true) { console.log(new Date().getTime(), "SUBSCRIBE", e.topic, e.handler); }
    this._$.on(e.topic, e.handler);
  }

  public unsubscribe(e : IAppEvent) : void {
    if(this._isDebug === true) { console.log(new Date().getTime(), "UNSUBSCRIBE", e.topic, e.data); }
    this._$.off(e.topic);
  }
}

export { Mediator };
