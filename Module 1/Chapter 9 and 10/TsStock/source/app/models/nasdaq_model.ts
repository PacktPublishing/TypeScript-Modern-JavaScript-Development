/// <reference path="../../framework/interfaces"/>

import { Model, AppEvent, ModelSettings } from "../../framework/framework";

@ModelSettings("./data/nasdaq.json")
class NasdaqModel extends Model implements IModel {

  constructor(metiator : IMediator) {
    super(metiator);
  }

  // listen to model events
  public initialize() {
    this.subscribeToEvents([
      new AppEvent("app.model.nasdaq.change", null, (e, args) => { this.onChange(args); })
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
          var stocks = { items : data, market : "NASDAQ" };

          // pass controll to the market view
          this.triggerEvent(new AppEvent("app.view.market.render", stocks, null));
        })
        .catch((e) => {
          // pass control to the global error handler
          this.triggerEvent(new AppEvent("app.error", e, null));
        });
  }
}

export { NasdaqModel };
