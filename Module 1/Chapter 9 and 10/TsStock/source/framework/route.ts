/// <reference path="./interfaces"/>

class Route implements IRoute {
  public controllerName : string;
  public actionName : string;
  public args : Object[];

  constructor(controllerName : string, actionName : string, args : Object[]){
    this.controllerName = controllerName;
    this.actionName = actionName;
    this.args = args;
  }

  public serialize() : string {
    var s, sargs;
    sargs = this.args.map(a => a.toString()).join("/");
    s = `${this.controllerName}/${this.actionName}/${sargs}`;
    return s;
  }
}

export { Route };
