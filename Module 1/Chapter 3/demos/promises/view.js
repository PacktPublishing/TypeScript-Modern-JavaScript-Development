var ViewAsync = (function () {
    function ViewAsync(config) {
        this._container = config.container;
        this._templateUrl = config.templateUrl;
        this._serviceUrl = config.serviceUrl;
        this._args = config.args;
    }
    ViewAsync.prototype._loadJsonAsync = function (url, args) {
        return Q.Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                data: args,
                success: function (json) {
                    resolve(json);
                },
                error: function (e) {
                    reject(e);
                }
            });
        });
    };
    ViewAsync.prototype._loadHbsAsync = function (url) {
        return Q.Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: "text",
                success: function (hbs) {
                    resolve(hbs);
                },
                error: function (e) {
                    reject(e);
                }
            });
        });
    };
    ViewAsync.prototype._compileHbsAsync = function (hbs) {
        return Q.Promise(function (resolve, reject) {
            try {
                var template = Handlebars.compile(hbs);
                resolve(template);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    ViewAsync.prototype._jsonToHtmlAsync = function (template, json) {
        return Q.Promise(function (resolve, reject) {
            try {
                var html = template(json);
                resolve(html);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    ViewAsync.prototype._appendHtmlAsync = function (html, container) {
        return Q.Promise(function (resolve, reject) {
            try {
                var $container = $(container);
                if ($container.length === 0) {
                    throw new Error("Container not found!");
                }
                $container.html(html);
                resolve($container);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    ViewAsync.prototype.renderAsync = function () {
        var _this = this;
        return Q.Promise(function (resolve, reject) {
            try {
                var getJson = _this._loadJsonAsync(_this._serviceUrl, _this._args);
                var getTemplate = _this._loadHbsAsync(_this._templateUrl).then(_this._compileHbsAsync);
                Q.all([getJson, getTemplate]).then(function (results) {
                    var json = results[0];
                    var template = results[1];
                    _this._jsonToHtmlAsync(template, json).then(function (html) {
                        return _this._appendHtmlAsync(html, _this._container);
                    }).then(function ($container) {
                        resolve($container);
                    });
                });
            }
            catch (error) {
                reject(error);
            }
        });
    };
    return ViewAsync;
})();
