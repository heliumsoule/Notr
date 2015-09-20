'use strict';

/* Controllers */
var notrApp = angular.module('notrApp', ['ui.ace']);

notrApp.controller('RawCtrl', function($scope) {
	$scope.showBox = function() {
		alert("Hello world");
	};
});

notrApp.directive('exportPdf', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			// console.log(element);
			var clickZone = element.children();
			console.log(clickZone);
		}
	}
});