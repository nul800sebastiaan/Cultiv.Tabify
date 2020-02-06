angular.module('umbraco.services').config([
    '$httpProvider',
    function ($httpProvider) {

        $httpProvider.interceptors.push(function ($q) {
            return {
                'request': function (request) {

                    var apps = ["content", "media" /*, "member"*/] ; 
                    for (var i = 0; i < apps.length; i++) {
                        var app = apps[i];

                        if (request.url.includes("views/" + app + "/apps/content/content.html")) {
                            var qs = "";

                            var queryString = request.url.split("?");
                            if (queryString[1]) {
                                qs = "?" + queryString[1];
                            }
                            
                            request.url = "/App_Plugins/Cultiv.Tabify/Views/" + app + ".html" + qs;
                            break;
                        }
                    }
                    return request || $q.when(request);
                }
            };
        });

    }]);