var baseUrl = "../shared/";

var testView = new View({
  container : "#demo",
  templateUrl : baseUrl + "talks.hbs",
  serviceUrl : baseUrl + "talks.json",
  args : {}
});

var renderSuccess = function(){
  alert("render done!");
}

var renderError = function(e){
  console.log(e);
}

testView.render(renderSuccess, renderError);
