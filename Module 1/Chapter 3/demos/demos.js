var DemoFile = (function () {
    function DemoFile() {
    }
    return DemoFile;
})();
function displayCode(appendTo, files) {
    for (var i = 0; i < files.length; i++) {
        (function (path, name, description) {
            $.ajax({
                url: path,
                type: "GET",
                dataType: "text",
                success: function (content) {
                    var scaped = $("<div/>").text(content).html();
                    var html = "<h2>" + name + "</h2>" + "<p>" + description + "</p>" + "<pre>" + scaped + "</pre>";
                    $(appendTo).append(html);
                },
                error: function (e) {
                   var html = '<div class="alert alert-info" role="alert"><b>Error: </b>' + e.message + '</div>';
                   $(appendTo).append(html);
                }
            });
        })(files[i].path, files[i].name, files[i].description);
    }
}
