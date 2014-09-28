'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings','$cookies', function ($scope, $location, authService, ngAuthSettings, $cookies) {

    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false
    };

    $scope.message = "";

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/orders');

        },
         function (err) {
             $scope.message = err.error_description;
         });
    };

    $scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        //var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "Account/ExternalLoginCallback?provider=" + provider
        //                                                            + "&response_type=token&client_id=" + ngAuthSettings.clientId
        //                                                            + "&redirect_uri=" + redirectUri;

        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "Account/ExternalLoginCallback?"
                                                                   +"returnUrl=" + $scope.encodeData(redirectUri) 
                                                                   + "&client_id=" + ngAuthSettings.clientId;

        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };
    
    $scope.encodeData = function(data){
            return encodeURIComponent(data).replace(/\-/g, "%2D").replace(/\_/g, "%5F").replace(/\./g, "%2E").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
    };

    $scope.authCompletedCB = function (fragment) {

        $scope.$apply(function () {

            //var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
            var userId = $cookies['csrftoken'];
            userId = $cookies['userId'];
            userId = $cookies.userId;
            authService.obtainAccessToken(fragment).then(function (response) {
                $location.path('/orders');
            });
        });
    }
}]);
