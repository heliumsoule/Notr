angular.module('myApp', []).controller('textParser', function($scope) {
	$scope.show = 0;
	$scope.errorWarning = "Today is a Saturday";
	$scope.nodeList = [];

	$scope.addSpaces = function() {
		inputText = $scope.inputText;
		console.log(typeof(inputText));
		if (typeof(inputText) === "string") {
			breakText = inputText.replace(/r?\n/g, '\n');
			breakText = breakText.split('\n');
			for (var item in breakText) {
				console.log("What is the item ", item);
				if (breakText[item] == '') {
					breakText.splice(item, 1);
				}
			}
			$scope.inputText = breakText;
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
		$scope.nodeList = [];
		var count = 0, foundAt = false;
		while (count < $scope.inputText.length) {
			currLine = $scope.inputText[count];
			if (currLine.length > 0) {
				if (currLine[0] !== "@") {
					$scope.errorWarning = "Specify a starting node with @ on line " + (count + 1);
					return;
				}
				else {
					var nodeData = {
						name: undefined,
						parent: {
							name: undefined,
							id: undefined,
							tier: undefined
						},
						text: []
					};
					if (/\(/.exec(currLine) == null) {
						$scope.errorWarning = "The starting node should be specified with the () on line " + count + 1;
						return;
					}
					else {
						var end = /\(/.exec(currLine).index;
						nodeData.name = currLine.substr(1, end - 1);
						$scope.nodeList.push(nodeData);
						count = count + 1;
						console.log($scope.nodeList);
						break;
					}

				}
			}
			count = count + 1;
		}
		for(var i = count; i < $scope.inputText.length; i++) {
			nodeList = [];
			var currLine = $scope.inputText[i];
			console.log("What is the currLine ", currLine);
			var indexSymAt = /@/.exec(currLine), indexSymPound = /-/.exec(currLine);
			console.log("Where is the error ? ");
			if (indexSymAt != null) {
				var nodeData = {
					name: undefined,
					parent: {
						name: undefined,
						id: undefined,
						tier: undefined
					},
					text: []
				};
				var atLRegExp = /[^\\]\(/, matchAtL = atLRegExp.exec(currLine);
				var atRRegExp = /\)/, matchAtR = atRRegExp.exec(currLine);
				if (matchAtL == null || matchAtR == null) {
					$scope.errorWarning = "Specify a parent description with (name) on line " + count;
					return;
				}
				else {
					console.log("Am I here ?");
					firstWordRegExp = /\w/;
					matchFirstWord = firstWordRegExp.exec(currLine);
					nodeData.name = currLine.substr(matchFirstWord.index,matchAtL.index);
					splicedList = currLine.substr(matchAtL.index + matchAtL[0].length - 1);
					console.log("What does splicedList look like ", splicedList);
					console.log("What does splicedList look like ", splicedList);
					console.log("What does splicedList look like ", splicedList);
					console.log("What does splicedList look like ", splicedList);
					var idRegExp = /id\s*=/, matchId = idRegExp.exec(splicedList);
					console.log("What is the matchId ", matchId);
					console.log("What is the matchId ", matchId);
					console.log("What is the matchId ", matchId);
					if (matchId == null) {
						nodeData.parent.id = undefined;
						var pLeftRegExp = /\#/, pRightRegExp = /\)/;
						// parenthesisRegExp = /\([\s\w]*\)/;
						var leftInd = pLeftRegExp.exec(splicedList), rightInd = pRightRegExp.exec(splicedList);
						if (leftInd == null) {
							$scope.errorWarning = "Parent name requires an # symbol on line " + count;
							return;
						}
						console.log("What is the splicedList ", splicedList);
						console.log("What is the name ", name);
						console.log("What is the right ind ", rightInd.index);
						console.log("What is the right ind ", rightInd.index - 2);
						console.log("What is the left ind ", leftInd);
						console.log("What is the right ind ", rightInd);
						var a = splicedList.substr(leftInd.index + 1, rightInd.index - 2);
						console.log(a.length);
						console.log(a);
						if (rightInd.index - leftInd.index > 1) {
							console.log("I'm NOT here ");
							nodeData.parent.name = splicedList.substr(leftInd.index + 1, rightInd.index - 2);
						}
						else {
							console.log("I'm here ");
							$scope.errorWarning = "Node requires a parent name on line " + count;
							return;
						}

					}
					else {
						// console.log("Okay here goes the last error.");
						var parentName = splicedList.substr(0, idRegExp.index), spaceBeforeRegExp = /\(\s\w/;
						// console.log("What is the parentName ", parentName);
						var matchSpaceBefore = spaceBeforeRegExp.exec(parentName);
						// console.log("What is the match ", matchSpaceBefore);
						if (matchSpaceBefore != null) 
							parentName = parentName.substr(matchSpaceBefore.index);
						// console.log("What is the parentName ", parentName);
						var commaSpaceRegExp = /[\s]*,[\s]*/;
						var matchCommaSpace = commaSpaceRegExp.exec(parentName);
						// console.log("Comma match ", matchCommaSpace);
						if (matchCommaSpace == null) {
							$scope.errorWarning = "Separate parent name and id with a comma on line " + count;
							return;
						}
						else {
							var poundSpaceRegExp = /#/, matchPound = poundSpaceRegExp.exec(parentName);
							if (matchPound == null) {
								$scope.errorWarning = "Parent name requires an # symbol on line " + count;
								return;
							}
							else {
								nodeData.parent.name = parentName.substr(matchPound.index + 1, commaSpaceRegExp.index);
							}
						}

					}
				}
				$scope.nodeList.push(nodeData)
			}
			else if (indexSymPound != null) {
				// console.log("WHOOO");
				// console.log($scope.nodeList);
				// console.log($scope.nodeList);
				$scope.nodeList[$scope.nodeList.length - 1].text.push(currLine.substr(indexSymPound.index + 1));
			}
			else {
				$scope.errorWarning = "Specify either an @ or - attribute at the start of line " + count;
				return;
			}
		}
		// console.log("What is the scope.nodeList ", $scope.nodeList);
	};
});
















