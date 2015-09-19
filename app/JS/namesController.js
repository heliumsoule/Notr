angular.module('myApp', []).controller('textParser', function($scope, $sce) {
	$scope.show = 0;
	$scope.errorWarning = $sce.trustAsHtml("<b>Sweeeeet</b>");

	$scope.addSpaces = function() {
		inputText = $scope.inputText;
		if (typeof(breakText) === "string") {
			breakText = inputText.replace(/r?\n/g, '\n');
			$scope.inputText = breakText.split('\n');
		}
		else {
			console.log("Put in a string.");
		}
		// console.log($scope.inputText[0]);
		// console.log($scope.inputText[0]);
	};

	$scope.parseText = function() {
		if ($scope.inputText == undefined) {
			console.log("You can't parse without putting in a string");
			return;
		}
		var text = $scope.inputText;
		nodeList = [];
		var count = 0, foundAt = false;
		// while !foundAt && count < $scope.inputText.length {
		// 	currLine = $scope.inputText[count];
		// 	if currLine[0] !== '@' {
		// 		// $scope.errorWarning = $sce.trustAsHtml('<b>Specify a starting node with @ on line +')
		// 	}
		// }
	}

});