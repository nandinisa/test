var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar']);

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/timeline", {
        controller: "timelineController",
        templateUrl: "/app/views/timeline.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/app/views/associate.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });

});

//var serviceBase = 'http://localhost:43868/';
var serviceBase = 'http://6b74cc2ca3764a3db82c8499ef1795aa.cloudapp.net/';
//var serviceBase = 'http://127.0.0.1:43868/'
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'test'
});

app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    //$httpProvider.defaults.xsrfCookieName = '__RequestVerificationToken';
    //$httpProvider.defaults.xsrfHeaderName = '__RequestVerificationToken';
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);


