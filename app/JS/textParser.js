angular.module('myApp', []).controller('textParser', function($scope) {
	$scope.show = 0;
	$scope.errorWarning = "Today is a Saturday";

	$scope.addSpaces = function() {
		inputText = $scope.inputText;
		console.log(typeof(inputText));
		if (typeof(inputText) === "string") {
			breakText = inputText.replace(/r?\n/g, '\n');
			$scope.inputText = breakText.split('\n');
			console.log($scope.inputText);
		}
		else {
			console.log("Put in a string.");
		}
	};

	$scope.parseText = function() {
		if ($scope.inputText == undefined) {
			console.log("You can't parse without putting in a string");
			return;
		}
		var text = $scope.inputText;
		nodeList = [];
		var count = 0, foundAt = false;
		while (count < $scope.inputText.length) {
			currLine = $scope.inputText[count];
			if (currLine.length > 0) {
				if (currLine[0] !== "@") {
					$scope.errorWarning = "Specify a starting node with @ on line " + (count + 1);
					return;
				}
				else {
					break;
				}
			}
			count = count + 1
		}

		for(var i = count; i < $scope.inputText.length; i++) {
			currLine = $scope.inputText.length[i];
			indexSym = /@/.exec(currLine)
			if (indexSym != -1) {
				var nodeData = {
					name: undefined,
					parent: undefined,
					text: []
				};
				var atRegExp = /[^\\]\(/, matchAt = atRegExp.exec(currLine);
				if (matchAt.index == -1) {
					$scope.errorWarning = "Specify a parent description with () on line " + count;
				}
				else {
					firstWordRegExp = /\w/;
					matchFirstWord = firstWordRegExp.exec(currLine);
					nodeData.name = currLine.substr(matchFirstWord.index,matchAt.index);
					var parentNode = {
						name: undefined,
						id: undefined
					};
					splicedList = currLine.substr(matchAt.index + matchAt[0].length);
					var idRegExp = /id\s*=/, matchId = idRegExp.exec(splicedList);
					if (matchAt.index == -1) {
						parentNode.id = undefined;
						parenthesisRegExp = /\([\s\w]*\)/;
						var name = parenthesisRegExp.exec(splicedList);
						if (name[0].length != 0)
							parentNode.name = name[0];
					}
					else {
						var parentName = splicedList.substr(0, idRegExp.index), spaceBeforeRegExp = /\s\w/;
						var matchSpaceBefore = spaceBeforeRegExp.exec(parentName);

						if (matchSpaceBefore.index != -1) 
							parentName = parentName.substr(matchSpaceBefore.index);

						var commaSpaceRegExp = /[\s]*,[\s]*/;
						

					}
				}
			}
		}
	};
});
















