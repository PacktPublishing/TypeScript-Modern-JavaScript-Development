/// <reference path="../../framework/interfaces"/>

import { Model, AppEvent, ModelSettings } from "../../framework/framework";

@ModelSettings("http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp")
class ChartModel extends Model implements IModel {

  constructor(metiator : IMediator) {
    super(metiator);
  }

  // listen to model events
  public initialize() {
    this.subscribeToEvents([
      new AppEvent("app.model.chart.change", null, (e, args) => { this.onChange(args); })
    ]);
  }

  // dispose model events
  public dispose() {
    this.unsubscribeToEvents();
  }

  private onChange(args) : void {

    // format args (more info at http://dev.markitondemand.com/)
    var p = {
      Normalized : false,
      NumberOfDays : 365,
      DataPeriod : "Day",
      Elements :[
        { Symbol : args , Type : "price", Params :["ohlc"] }
      ]
    };
    var queryString = "parameters=" + encodeURIComponent(JSON.stringify(p));

    this.getAsync("jsonp", queryString)
        .then((data) => {

          // format data
          var chartData = this.formatModel(args, data);

          // pass controll to the market view
          this.triggerEvent(new AppEvent("app.view.chart.render", chartData, null));
        })
        .catch((e) => {
          // pass control to the global error handler
          this.triggerEvent(new AppEvent("app.error", e, null));
        });
  }

  private formatModel(symbol, data) {
    // more info at http://dev.markitondemand.com/
    // and http://www.highcharts.com/demo/line-time-series
    var chartData = {
      title : symbol,
      series : []
    };

    var series = [
      { name : "open", data : data.Elements[0].DataSeries.open.values },
      { name : "close", data : data.Elements[0].DataSeries.close.values },
      { name : "high", data : data.Elements[0].DataSeries.high.values },
      { name : "low", data : data.Elements[0].DataSeries.low.values }
    ];

    for(var i = 0; i < series.length; i++) {
      var serie = {
        name: series[i].name,
        data: []
      }

      for(var j = 0; j < series[i].data.length; j++){
        var val = series[i].data[j];
        var d = new Date(data.Dates[j]).getTime();
        serie.data.push([d, val]);
      }

      chartData.series.push(serie);
    }
    return chartData;
  }
}

export { ChartModel };
