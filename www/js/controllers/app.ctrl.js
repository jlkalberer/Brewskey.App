﻿angular.module('tappt.controllers', [])

.controller('AppCtrl', function ($scope, auth, $localStorage, $ionicHistory, $state, nfcService) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.userName = $localStorage.authDetails.userName;

	$scope.settings = $localStorage.settings;

	$scope.logout = function () {
		auth.logout();

		$ionicHistory.nextViewOptions({
          historyRoot: true
        });

        $state.go('app.login');
	};

    $scope.showPopup = function() {
        nfcService.showPopup();
    };
});