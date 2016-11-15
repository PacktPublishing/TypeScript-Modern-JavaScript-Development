/// <reference path="../../framework/interfaces"/>

import { Controller, AppEvent } from "../../framework/framework";
import { QuoteModel } from "../models/quote_model";
import { ChartModel } from "../models/chart_model";
import { SymbolView } from "../views/symbol_view";
import { ChartView } from "../views/chart_view";

class SymbolController extends Controller implements IController {
  private _quoteModel : IModel;
  private _chartModel : IModel;
  private _symbolView : IView;
  private _chartView : IView;

  constructor(metiator : IMediator) {
    super(metiator);
    this._quoteModel = new QuoteModel(metiator);
    this._chartModel = new ChartModel(metiator);
    this._symbolView = new SymbolView(metiator);
    this._chartView = new ChartView(metiator);
  }

  // initialize views/ models and strat listening to controller actions
  public initialize() : void {

    // subscribe to controller action events
    this.subscribeToEvents([
      new AppEvent("app.controller.symbol.quote", null, (e, symbol : string) => { this.quote(symbol); })
    ]);

    // initialize view and models events
    this._quoteModel.initialize();
    this._chartModel.initialize();
    this._symbolView.initialize();
    this._chartView.initialize();
  }

  // dispose views/models and stop listening to controller actions
  public dispose() : void {

    // dispose the controller events
    this.unsubscribeToEvents();

    // dispose views and model events
    this._symbolView.dispose();
    this._quoteModel.dispose();
    this._chartView.dispose();
    this._chartModel.dispose();
  }

  public quote(symbol : string) {
    this.triggerEvent(new AppEvent("app.model.quote.change", symbol, null));
  }
}

export { SymbolController };
