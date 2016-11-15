/// <reference path="./interfaces"/>

import { EventEmitter } from "./event_emitter";

function ModelSettings(serviceUrl : string) {
  return function(target : any) {
    // save a reference to the original constructor
    var original = target;

    // a utility function to generate instances of a class
    function construct(constructor, args) {
      var c : any = function () {
        return constructor.apply(this, args);
      }
      c.prototype = constructor.prototype;
      var instance =  new c();
      instance._serviceUrl = serviceUrl;
      return instance;
    }

    // the new constructor behaviour
    var f : any = function (...args) {
      return construct(original, args);
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;

    // return new constructor (will override original)
    return f;
  }
}

class Model extends EventEmitter implements IModel {

  // the values of _serviceUrl must be set using the ModelSettings decorator
  private _serviceUrl : string;

  constructor(metiator : IMediator) {
    super(metiator);
  }

  // must be implemented by derived classes
  public initialize() {
    throw new Error('Model.prototype.initialize() is abstract and must implemented.');
  }

  // must be implemented by derived classes
  public dispose() {
    throw new Error('Model.prototype.dispose() is abstract and must implemented.');
  }

  protected requestAsync(method : string, dataType : string, data) {
    return Q.Promise((resolve : (r) => {}, reject : (e) => {}) => {
      $.ajax({
        method: method,
        url: this._serviceUrl,
        data : data || {},
        dataType: dataType,
        success: (response) => {
          resolve(response);
        },
        error : (...args : any[]) => {
          reject(args);
        }
      });
    });
  }

  protected getAsync(dataType : string, data : any) {
    return this.requestAsync("GET", dataType, data);
  }

  protected postAsync(dataType : string, data : any) {
    return this.requestAsync("POST", dataType, data);
  }

  protected putAsync(dataType : string, data : any) {
    return this.requestAsync("PUT", dataType, data);
  }

  protected deleteAsync(dataType : string, data : any) {
    return this.requestAsync("DELETE", dataType, data);
  }
}

export { Model, ModelSettings };
