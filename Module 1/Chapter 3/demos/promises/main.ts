var baseUrl = "../shared/";

var asyncView = new ViewAsync({
  container : "#demo",
  templateUrl : baseUrl + "talks.hbs",
  serviceUrl : baseUrl + "talks.json",
  args : {}
});

asyncView.renderAsync()
         .then(function(){  alert("render done!"); })
         .catch(function(e){ console.log(e); });
