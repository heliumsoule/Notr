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
			count = count + 1;
		}

		for(var i = count; i < $scope.inputText.length; i++) {
			var currLine = $scope.inputText.length[i];
			var indexSymAt = /@/.exec(currLine).index, indexSymPound = /-/.exec(currLine).index;
			if (indexSymAt != -1) {
				var nodeData = {
					name: undefined,
					parent: {
						name: undefined,
						id: undefined,
						tier: undefined
					},
					text: []
				};
				var atRegExp = /[^\\]\(/, matchAt = atRegExp.exec(currLine);
				if (matchAt.index == -1) {
					$scope.errorWarning = "Specify a parent description with (name) on line " + count;
					return;
				}
				else {
					firstWordRegExp = /\w/;
					matchFirstWord = firstWordRegExp.exec(currLine);
					nodeData.name = currLine.substr(matchFirstWord.index,matchAt.index);
					splicedList = currLine.substr(matchAt.index + matchAt[0].length);
					var idRegExp = /id\s*=/, matchId = idRegExp.exec(splicedList);
					if (matchAt.index == -1) {
						parentNode.id = undefined;
						parenthesisRegExp = /\([\s\w]*\)/;
						var name = parenthesisRegExp.exec(splicedList);
						if (name[0].length != 0) {
							parentNode.name = name[0];
						}
						else {
							$scope.errorWarning = "Node requires a parent name on line " + count;
							return;
						}

					}
					else {
						var parentName = splicedList.substr(0, idRegExp.index), spaceBeforeRegExp = /\s\w/;
						var matchSpaceBefore = spaceBeforeRegExp.exec(parentName);

						if (matchSpaceBefore.index != -1) 
							parentName = parentName.substr(matchSpaceBefore.index);

						var commaSpaceRegExp = /[\s]*,[\s]*/;
						var matchCommaSpace = commaSpaceRegExp.exec(parentName);
						if (matchCommaSpace.index == -1) {
							$scope.errorWarning = "Separate parent name and id with a comma on line " + count;
							return;
						}
						else {
							var poundSpaceRegExp = /#/, matchPound = poundSpaceRegExp.exec(parentName);
							if (matchPound.index == -1) {
								$scope.errorWarning = "Parent name requires an # symbol on line " + count;
								return;
							}
							else {
								node.parent.name = parentName.substr(matchPound.index + 1, commaSpaceRegExp.index);
							}
						}

					}
				}
				nodeList.append(nodeData)
			}
			else if (indexSymPound != -1) {
				nodeList[-1].text.append(currLine.substr(indexSymPound + 1));
			}
		}
	};
});
















