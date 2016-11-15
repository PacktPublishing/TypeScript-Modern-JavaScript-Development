/// <reference path="../../framework/interfaces"/>

import { Model, AppEvent, ModelSettings } from "../../framework/framework";

@ModelSettings("./data/nyse.json")
class NyseModel extends Model implements IModel {

  constructor(metiator : IMediator) {
    super(metiator);
  }

  // listen to model events
  public initialize() {
    this.subscribeToEvents([
      new AppEvent("app.model.nyse.change", null, (e, args) => { this.onChange(args); })
    ]);
  }

  // dispose model events
  public dispose() {
    this.unsubscribeToEvents();
  }

  private onChange(args) : void {
    this.getAsync("json", args)
        .then((data) => {

          // format data
          var stocks = { items : data, market : "NYSE" };

          // pass controll to the market view
          this.triggerEvent(new AppEvent("app.view.market.render", stocks, null));
        })
        .catch((e) => {
          // pass control to the global error handler
          this.triggerEvent(new AppEvent("app.error", e, null));
        });
  }
}

export { NyseModel };
