///<reference path="./references.d.ts" />

import Handlebars   = require('handlebars');
import Promise      = require("bluebird");

class Model {

  private _modelUrl : string;
  private _formatter : Function;

  constructor(moduleUrl : string, formatter : Function) {
    this._modelUrl = moduleUrl;
    this._formatter = formatter;
  }
  private genericAjaxCallAsync(method : string, args : Object) : Promise<{}>{
    return new Promise((resolve, reject) => {
      $.ajax({
        url : this._modelUrl,
        data : args,
        success : (response) => {
          if(typeof this._formatter === "function"){
            response = this._formatter(response);
          }
          resolve(response);
        },
        error : function(error) {
          reject(error);
        }
      });
    });
  }
  public getAsync(args : Object) : Promise<{}> {
      return this.genericAjaxCallAsync("GET", args);
  }
}

export = Model;
