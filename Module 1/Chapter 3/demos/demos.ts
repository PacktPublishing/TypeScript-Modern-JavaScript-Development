///<reference path="../typings/handlebars/handlebars.d.ts" />
///<reference path="../typings/jquery/jquery.d.ts" />

class DemoFile {
  path : string;
  name : string;
  description : string;
}

function displayCode(appendTo : string, files : DemoFile[]) {
  for(var i = 0; i < files.length; i++) {
    (function(path, name, description) {


      $.ajax({
        url: path,
  	    type: "GET",
  	    dataType: "text",
  	    success: (content) => {

          var scaped = $("<div/>").text(content).html();

          var html =  "<h2>" + name + "</h2>" +
                      "<p>" + description + "</p>" +
                      "<pre>" + scaped + "</pre>";

          $(appendTo).append(html);
  	    },
  	    error: (e) => {
  	      console.log(e);
  	    }
      });
    })(files[i].path, files[i].name, files[i].description);
  }
}
