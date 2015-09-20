'use strict';

/* Controllers */
var notrApp = angular.module('notrApp', ['ui.ace']);

notrApp.controller('RawCtrl', function ($scope) {
	$scope.showBox = function() {
		alert("Hello world");
	};
	
});