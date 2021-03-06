﻿'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };
    
    var _testCors = function (serviceUrl, data) {
        var deferred = $q.defer();
        $http.post(serviceUrl, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            deferred.resolve(response);

        }).error(function (err, status) {
            deferred.reject(err);
        });
        
        //$http.get(serviceUrl).success(function (response) {
        //    deferred.resolve(response);

        //}).error(function (err, status) {
        //    deferred.reject(err);
        //});

        return deferred.promise;
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'account/register', registration).then(function (response) {
            return response;
        });

    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

            if (loginData.useRefreshTokens) {
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
            }
            else {
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
            }
            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {
        var authData = localStorageService.get('authorizationData');
        //localStorageService.remove('authorizationData');

        //_authentication.isAuth = false;
        //_authentication.userName = "";
        //_authentication.useRefreshTokens = false;
        var data = 'http://localhost:1337/#home';
        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "Account/LogOff?";
        //var oauthWindow = window.open(externalProviderUrl, '_self', "location=0,status=0,width=600,height=750");
        var deferred = $q.defer();
        $http.post(serviceBase + 'Account/LogOff', data, {
            withCredentials: true, 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'RequestVerificationToken' : authData.token }
        }).success(function (response) {
            deferred.resolve(response);

            localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.useRefreshTokens = false;

        }).error(function (err, status) {
            deferred.reject(err); 
        });
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
        }

    };
    
    var _setAuthData = function (externalData) {
        var deferred = $q.defer();
        localStorageService.set('authorizationData', { token: externalData.token, userName: externalData.userName, refreshToken: "", useRefreshTokens: false });
        
        _authentication.isAuth = true;
        _authentication.userName = externalData.external_user_name;
        _authentication.useRefreshTokens = false;

        deferred.resolve(true);

        return deferred.promise;
    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();
        
        localStorageService.set('authorizationData', { token: 'test', userName: externalData.userName, refreshToken: "", useRefreshTokens: false });
        
        _authentication.isAuth = true;
        _authentication.userName = externalData.external_user_name;
        _authentication.useRefreshTokens = false;
        deferred.resolve();
        //$http.get(serviceBase + 'account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

        //    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

        //    _authentication.isAuth = true;
        //    _authentication.userName = response.userName;
        //    _authentication.useRefreshTokens = false;

        //    deferred.resolve(response);

        //}).error(function (err, status) {
        //    _logOut();
        //    deferred.reject(err);
        //});

        return deferred.promise;

    };

    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };
    
    authServiceFactory.testCors = _testCors;
    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.setAuthData = _setAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
}]);