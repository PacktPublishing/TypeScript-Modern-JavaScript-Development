/// <reference path="./interfaces"/>

import { AppEvent } from "./app_event";

 class EventEmitter implements IEventEmitter{
   protected _metiator : IMediator;
   protected _events : Array<IAppEvent>;

   constructor(metiator : IMediator) {
     this._metiator = metiator;
   }

   public triggerEvent(event : IAppEvent){
     this._metiator.publish(event);
   }

   public subscribeToEvents(events : Array<IAppEvent>) {
     this._events = events;
     for(var i = 0; i < this._events.length; i++) {
       this._metiator.subscribe(this._events[i]);
     }
   }

   public unsubscribeToEvents() {
     for(var i = 0; i < this._events.length; i++) {
       this._metiator.unsubscribe(this._events[i]);
     }
   }
 }
 export { EventEmitter };
