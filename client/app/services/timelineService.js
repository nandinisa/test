'use strict';
app.factory('timelineService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var timelineServiceFactory = {};

    var _getTimeline = function () {
        return $http.get(serviceBase + 'api/timeline').then(function (results) {
            return results;
        });
    };

    timelineServiceFactory.getTimeline = _getTimeline;

    return timelineServiceFactory;

}]);