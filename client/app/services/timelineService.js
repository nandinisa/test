'use strict';
app.factory('timelineService', ['$http', '$cookies', 'ngAuthSettings', function ($http, $cookies, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var timelineServiceFactory = {};

    var _getTimeline = function () {
        return $http.get(serviceBase + 'api/timeline',{withCredentials: true}).then(function (results) {
            return results;
        });
    };

    timelineServiceFactory.getTimeline = _getTimeline;

    return timelineServiceFactory;

}]);