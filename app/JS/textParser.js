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
				if (breakText[item] == '') {
					breakText.splice(item, 1);
				}
			}
			$scope.inputText = breakText;
			console.log($scope.inputText);
		}
		else {
			$scope.errorWarning = "Please put text into the note taker";
		}
	};

	$scope.parseText = function() {
		if ($scope.inputText == undefined) {
			$scope.errorWarning = "You can't parse without putting in text";
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
						nodeData.name = currLine.substring(1, end);
						$scope.nodeList.push(nodeData);
						count = count + 1;
						break;
					}

				}
			}
			count = count + 1;
		}
		for(var i = count; i < $scope.inputText.length; i++) {
			nodeList = [];
			var currLine = $scope.inputText[i];
			var indexSymAt = /@/.exec(currLine), indexSymPound = /-/.exec(currLine);
			if (indexSymAt != null) {
				var nodeData = {
					name: undefined,
					parent: {
						name: undefined,
						id: undefined
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
					firstWordRegExp = /\w/;
					matchFirstWord = firstWordRegExp.exec(currLine);
					nodeData.name = currLine.substring(matchFirstWord.index, matchAtL.index + 1);
					splicedList = currLine.substring(matchAtL.index + matchAtL[0].length);
					var idRegExp = /id\s*=/, matchId = idRegExp.exec(splicedList);
					if (matchId == null) {
						nodeData.parent.id = undefined;
						var pLeftRegExp = /\#/, pRightRegExp = /\)/;
						// parenthesisRegExp = /\([\s\w]*\)/;
						var leftInd = pLeftRegExp.exec(splicedList), rightInd = pRightRegExp.exec(splicedList);
						if (leftInd == null) {
							$scope.errorWarning = "Parent name requires an # symbol on line " + count;
							return;
						}
						var a = splicedList.substring(leftInd.index + 1, rightInd.index);
						if (rightInd.index - leftInd.index > 1) {
							nodeData.parent.name = splicedList.substring(leftInd.index + 1, rightInd.index);
						}
						else {
							$scope.errorWarning = "Node requires a parent name on line " + count;
							return;
						}

					}
					else {
						// cognsole.log("Okay here goes the last error.");
						var parentName = splicedList.substring(0, matchId.index), spaceBeforeRegExp = /\(\s\w/;
						var commaSpaceRegExp = /[\s]*,[\s]*/;
						var matchCommaSpace = commaSpaceRegExp.exec(parentName);
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
								// var commaInd = parentName.lastIndexOf(',')
								nodeData.parent.name = parentName.substring(matchPound.index + 1, matchCommaSpace.index);
								splicedList = splicedList.substring(matchId.index, splicedList.length);
								var endCutter = /[\s]*\)/;
								var startCutter = /=[\s]*/;
								splicedList = splicedList.replace(/[\s]*\)/, '\)');
								nodeData.parent.id = splicedList.substring(startCutter.exec(splicedList).index + 1, splicedList.lastIndexOf(')'));
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
				$scope.nodeList[$scope.nodeList.length - 1].text.push(currLine.substring(indexSymPound.index + 1));
			}
			else {
				$scope.errorWarning = "Specify either an @ or - attribute at the start of line " + count;
				return;
			}
		}
		// console.log("What is the scope.nodeList ", $scope.nodeList);
		console.log($scope.nodeList);
	};
	$scope.sortNodes = function() {
		nodeList = $scope.nodeList;
		var node;
		var sortedNodes = [];
		for (var x=0; x < nodeList.length; x++) {
			node = nodeList[x];
			if (node.parent.name == undefined) {
				sortedNodes[0] = [node];
				nodeList.splice(x,1);
			}
		}
		var i = 0;
		while (i < nodeList.length) {
			if (sortedNodes[i].length == 0) {
				break;
			}
			sortedNodes[i+1] = [];
			for (var y = 0; y < sortedNodes[i].length; y++) {
				for (var z = 0; z < nodeList.length; z++) {
					if (nodeList[z].parent.name == sortedNodes[i][y].name) {
						sortedNodes[i+1].push(nodeList[z]);
					}
				}
			}
			i++;
		}
		sortedNodes.pop();
		console.log(sortedNodes);
	}
});
















