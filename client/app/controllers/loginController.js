'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings', function ($scope, $location, authService, ngAuthSettings) {

    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false
    };

    $scope.message = "";

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/timeline');

        },
         function (err) {
             $scope.message = err.error_description;
         });
    };
    
    $scope.testCors = function () {
        var serviceUrl = 'http://localhost:55450/test/index';
        
        //var method = 'post';
        
        //$.ajax({
        //    type: method,
        //    url: serviceUrl
        //}).done(function (data) {
        //    $('#value1').text(data);
        //}).error(function (jqXHR, textStatus, errorThrown) {
        //    $('#value1').text(jqXHR.responseText || textStatus);
        //});
        //http://localhost:1337/
        authService.testCors(serviceUrl, 'dummy').then(function (response) {
            $('#value1').text(response);
        });
    }

    $scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        //var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "Account/ExternalLoginCallback?provider=" + provider
        //                                                            + "&response_type=token&client_id=" + ngAuthSettings.clientId
        //                                                            + "&redirect_uri=" + redirectUri;

        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "Account/ExternalLoginCallback?"
                                                                   +"returnUrl=" + $scope.encodeData(redirectUri) 
                                                                   + "&client_id=" + ngAuthSettings.clientId;

        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, 'Account Controller', "location=0,status=0,width=600,height=750");
        //oauthWindow.opener = true;
        //window.showModalDialog(externalProviderUrl, window, "dialogHeight:400px; dialogWidth:600px;");
    };
    
    $scope.encodeData = function(data){
            return encodeURIComponent(data).replace(/\-/g, "%2D").replace(/\_/g, "%5F").replace(/\./g, "%2E").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
    };

    $scope.authCompletedCB = function (fragment) {

        $scope.$apply(function () {

            //var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
            
            authService.setAuthData(fragment).then(function () {
                $location.path('/timeline');
            });
        });
    }
}]);
