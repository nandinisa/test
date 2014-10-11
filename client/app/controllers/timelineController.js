'use strict';
app.controller('timelineController', ['$scope', 'timelineService', function ($scope, timelineService) {

    $scope.timelines = [];
    //var serviceBase = 'http://localhost:43868/';
    var serviceBase = 'http://6b74cc2ca3764a3db82c8499ef1795aa.cloudapp.net/';
    var xhr = new XMLHttpRequest()
    xhr.open("GET", serviceBase + 'api/timeline', true);
    xhr.withCredentials = true
    xhr.onreadystatechange = function () {
        if (this.status === 200) {
            if (this.responseText !== '') {
                $scope.timelines = JSON.parse(this.responseText);
            }
            else {
                $scope.timelines = '';
            }
            $scope.$apply();
        }
    }
    xhr.send();

    //timelineService.getTimeline().then(function (results) {

    //    $scope.timelines = results.data;

    //}, function (error) {
    //    //alert(error.data.message);
    //});

}]);