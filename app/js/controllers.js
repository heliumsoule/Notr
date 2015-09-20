'use strict';

/* Controllers */
var notrApp = angular.module('notrApp', ['ui.ace']);

notrApp.controller('EditorCtrl', function($scope) {
	$scope.showBox = function() {
		alert("Hello world");
	};
	$scope.print = function(aceValue) {
		console.log(aceValue);
	}

	$scope.show = 0;
	$scope.errorWarning = "";
	$scope.nodeList = [];

	$scope.addSpaces = function() {
		// console.log(inputText);
		var inputText = $scope.inputText;
		console.log(typeof(inputText));
		if (typeof(inputText) === "string") {
			var breakText = inputText.replace(/r?\n/g, '\n');
			breakText = breakText.split('\n');
			for (var item in breakText) {
				if (breakText[item] == '') {
					breakText.splice(item, 1);
				}
			}
			$scope.arrText = breakText;
			console.log($scope.arrText);
			$scope.errorWarning = "";
		}
		else {
			$scope.errorWarning = "Please put text into the note taker";
		}
	};

	$scope.parseText = function() {
		if ($scope.arrText == undefined) {
			$scope.errorWarning = "You can't parse without putting in text";
			return;
		}
		var text = $scope.arrText;
		$scope.nodeList = [];
		var count = 0, foundAt = false;
		while (count < $scope.arrText.length) {
			currLine = $scope.arrText[count];
			if (currLine.length > 0) {
				if (currLine[0] !== "@") {
					$scope.errorWarning = "Specify a starting node with @ on line " + (count + 1);
					return;
				}
				else {
					$scope.errorWarning = "";
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
						$scope.errorWarning = "";
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
		for(var i = count; i < $scope.arrText.length; i++) {
			var nodeList = [];
			var currLine = $scope.arrText[i];
			var indexSymAt = /@/.exec(currLine), indexSymPound = /-/.exec(currLine);
			if (indexSymAt != null) {
				$scope.errorWarning = "";
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
					$scope.errorWarning = "";
					var firstWordRegExp = /\w/, matchFirstWord = firstWordRegExp.exec(currLine);
					nodeData.name = currLine.substring(matchFirstWord.index, matchAtL.index + 1);
					var splicedList = currLine.substring(matchAtL.index + matchAtL[0].length);
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
							$scope.errorWarning = "";
							var poundSpaceRegExp = /#/, matchPound = poundSpaceRegExp.exec(parentName);
							if (matchPound == null) {
								$scope.errorWarning = "Parent name requires an # symbol on line " + count;
								return;
							}
							else {
								$scope.errorWarning = "";
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
				$scope.errorWarning = "";
				$scope.nodeList[$scope.nodeList.length - 1].text.push(currLine.substring(indexSymPound.index + 1));
			}
			else {
				$scope.errorWarning = "Specify either an @ or - attribute at the start of line " + count;
				return;
			}
		}
		console.log($scope.nodeList);
	};

	$scope.sortNodes = function() {
		var nodeList = $scope.nodeList;
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

notrApp.directive('exportPdf', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			// console.log(element);
			var clickZone = element.children();
			// console.log(clickZone);
		}
	}
});