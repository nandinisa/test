'use strict';
app.controller('timelineController', ['$scope', 'timelineService', function ($scope, timelineService) {

    $scope.timelines = [];

    timelineService.getTimeline().then(function (results) {

        $scope.timelines = results.data;

    }, function (error) {
        //alert(error.data.message);
    });

}]);