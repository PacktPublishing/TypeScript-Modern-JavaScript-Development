///<reference path="./references.d.ts" />

import Handlebars   = require('handlebars');
import Promise      = require("bluebird");
import Model        = require('./model');

class View {
  private _container : string;
  private _templateUrl : string;
  private _model : Model;

  constructor(templateUrl : string, container : string, model : Model){
    this._container = container;
    this._templateUrl = templateUrl;
    this._model = model;
  }
  public render() {
    // if(this._model === null) {
    //  throw new Error("not implemented!");
    // }
    // else {
    $.ajax({
      url : this._templateUrl,
      success : (text) => {
        var template : any = Handlebars.compile(text);
        var html = template({});
        $(this._container).html(html);
      },
      error : function(error) {
        console.log(error);
      }
    });
    // }
  }
}

export = View;
