'use strict';
app.factory('ordersService', ['$http', '$cookies', 'ngAuthSettings', function ($http, $cookies, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _getOrders = function () {
        var userId = $cookies['userId'];
        $http.defaults.headers.common["X-CSRFToken"] = $cookies['csrftoken'];
        return $http.get(serviceBase + 'api/timeline',{withCredentials: true}).then(function (results) {
            return results;
        });
        //return $http.get('timeline', { withCredentials: true }).then(function (results) {
        //    return results;
        //});
    };

    ordersServiceFactory.getOrders = _getOrders;

    return ordersServiceFactory;

}]);