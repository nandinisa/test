'use strict';
app.factory('timelineService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var timelineServiceFactory = {};

    var _getTimeline = function () {
        return $http.get(serviceBase + 'api/timeline', {withCredentials: true}).then(function (results) {
            return results;
        });
        
        //var xhr = new XMLHttpRequest()
        //xhr.open("GET", serviceBase + 'api/timeline', true);
        //xhr.withCredentials = true
        //xhr.onreadystatechange = function () {
        //    if (this.status === 200) {
        //        results = JSON.parse(this.responseText);
        //        onload(results);
        //    }
        //}
        //xhr.send();

    };

    timelineServiceFactory.getTimeline = _getTimeline;

    return timelineServiceFactory;

}]);