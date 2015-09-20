'use strict';

/* Controllers */
var notrApp = angular.module('notrApp', ['ui.ace']);

notrApp.controller('EditorCtrl', function($scope, $document) {
	$scope.graph = function(prevNode, currNode) {
		for (var i = 0; i < prevNode.length; i++) {
			for (var j = 0; j < currNode.length; j++) {

			}
		}
	};

	$scope.sortCorrectly = function() {
		var nodeList = $scope.nodeList;
		for (var i = 0; i < nodeList.length; i++) {
			var currElt = nodeList[i];
			if (currElt.parent.name != undefined) {
				var j = 0;
				while (true) {
					var otherElt = nodeList[j];
					if (otherElt.name === currElt.parent.name) {
						currElt.parent.count = j;
						break;
					}
					j = j + 1;
				}
			}
		}
		$scope.nodeList = nodeList;
		console.log(JSON.stringify($scope.nodeList));
		console.log($scope.nodeList.sort(function(nodeOne, nodeTwo) {
			if (nodeOne.parent.count - nodeTwo.parent.count > 0) return 1;
			else if (nodeOne.parent.count - nodeTwo.parent.count < 0) return -1;
			else return 0;
		}));

	};

	$scope.sortMore = function() {
		var nodeList = [];
		for (var i = 0; i < $scope.nodeList.length; i++) {
			var currArr = $scope.nodeList[i];
			var inputArr = [currArr];
			while (true && i < $scope.nodeList.length - 1) {
				var nextArr = $scope.nodeList[++i];
				console.log("What is the current i ", i);
				if (currArr.parent.count === nextArr.parent.count) {
					inputArr.push(nextArr);
				} else {
					i = i - 1;
					break;
				}
			}
			nodeList.push(inputArr);
		}

		console.log(nodeList);
		$scope.nodeList = nodeList;
	};

	$scope.show = 0;
	$scope.errorWarning = "";
	$scope.nodeList = [];

	$scope.addSpaces = function() {
		// console.log(inputText);
		var inputText = $scope.inputText;


		if (typeof(inputText) === "string") {
			var breakText = inputText.replace(/r?\n/g, '\n');
			breakText = breakText.split('\n');
			for (var item in breakText) {
				if (breakText[item] == '') {
					breakText.splice(item, 1);
				}
			}
			$scope.arrText = breakText;
			console.log(breakText);
		} else {
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
		var count = 0,
			foundAt = false;
		while (count < $scope.arrText.length) {
			currLine = $scope.arrText[count];
			if (currLine.length > 0) {
				if (currLine[0] !== "@") {
					$scope.errorWarning = "Specify a starting node with @ on line " + (count + 1);
					return;
				} else {
					$scope.errorWarning = "";
					var nodeData = {
						name: undefined,
						parent: {
							name: undefined,
							id: undefined,
							count: -1
						},
						text: []
					};
					if (/\(/.exec(currLine) == null) {
						$scope.errorWarning = "The starting node should be specified with the () on line " + count + 1;
						return;
					} else {
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
		for (var i = count; i < $scope.arrText.length; i++) {
			var nodeList = [];
			var currLine = $scope.arrText[i];
			var indexSymAt = /@/.exec(currLine),
				indexSymPound = /-/.exec(currLine);
			if (indexSymAt != null) {
				var nodeData = {
					name: undefined,
					parent: {
						name: undefined,
						id: undefined
					},
					text: []
				};
				var atLRegExp = /[^\\]\(/,
					matchAtL = atLRegExp.exec(currLine);
				var atRRegExp = /\)/,
					matchAtR = atRRegExp.exec(currLine);
				if (matchAtL == null || matchAtR == null) {
					$scope.errorWarning = "Specify a parent description with (name) on line " + count;
					return;
				} else {
					$scope.errorWarning = "";
					var firstWordRegExp = /\w/,
						matchFirstWord = firstWordRegExp.exec(currLine);
					nodeData.name = currLine.substring(matchFirstWord.index, matchAtL.index + 1);
					var splicedList = currLine.substring(matchAtL.index + matchAtL[0].length);
					var idRegExp = /id\s*=/,
						matchId = idRegExp.exec(splicedList);
					if (matchId == null) {
						nodeData.parent.id = undefined;
						var pLeftRegExp = /\#/,
							pRightRegExp = /\)/;
						// parenthesisRegExp = /\([\s\w]*\)/;
						var leftInd = pLeftRegExp.exec(splicedList),
							rightInd = pRightRegExp.exec(splicedList);
						if (leftInd == null) {
							$scope.errorWarning = "Parent name requires an # symbol on line " + count;
							return;
						}
						var a = splicedList.substring(leftInd.index + 1, rightInd.index);
						if (rightInd.index - leftInd.index > 1) {
							$scope.errorWarning = "";
							nodeData.parent.name = splicedList.substring(leftInd.index + 1, rightInd.index);
						} else {
							$scope.errorWarning = "Node requires a parent name on line " + count;
							return;
						}

					} else {
						// cognsole.log("Okay here goes the last error.");
						var parentName = splicedList.substring(0, matchId.index),
							spaceBeforeRegExp = /\(\s\w/;
						var commaSpaceRegExp = /[\s]*,[\s]*/;
						var matchCommaSpace = commaSpaceRegExp.exec(parentName);
						if (matchCommaSpace == null) {
							$scope.errorWarning = "Separate parent name and id with a comma on line " + count;
							return;
						} else {
							$scope.errorWarning = "";
							var poundSpaceRegExp = /#/,
								matchPound = poundSpaceRegExp.exec(parentName);
							if (matchPound == null) {
								$scope.errorWarning = "Parent name requires an # symbol on line " + count;
								return;
							} else {
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
			} else if (indexSymPound != null) {
				$scope.errorWarning = "";
				$scope.nodeList[$scope.nodeList.length - 1].text.push(currLine.substring(indexSymPound.index + 1));
			} else {
				$scope.errorWarning = "Specify either an @ or - attribute at the start of line " + count;
				return;
			}
		}
		console.log("What is the scope", $scope.nodeList);
	};

	//graph.js datacontroller
	$scope.height = 1500;
	$scope.width = 1500;
	$scope.block = [];
	$scope.link = [];
	$scope.dis_block = [];
	$scope.dis_link = [];
	this.map = function() {
		console.log($scope.nodeList.length);
		for (var i = 0; i < $scope.nodeList.length; i++) {
			console.log($scope.nodeList[i].length);
			for (var j = 0; j < $scope.nodeList[i].length; j++) {
				if (i == 0) {
					$scope.dis_block.push({
						x: $scope.width / 2,
						y: 110 / 2,
						w: 250,
						h: 110,
						color: d3.scale.category10()(9),
						text: $scope.nodeList[i][j].name
					});
				} else {
					$scope.dis_block.push({
						x: ((($scope.width - $scope.nodeList[i].length * (250 + 90) + 90) / 2) + (250 / 2) + j * 340),
						y: (110 + 90) * i + (110 / 2),
						w: 250,
						h: 110,
						color: d3.scale.category10()(9),
						text: $scope.nodeList[i][j].name,
						txlist: $scope.nodeList[i][j].text,
						txt1:"",
						txt2:"",
						txt3:"",
						txt4:""
					});
					var thisblock = $scope.dis_block[$scope.dis_block.length-1];
					var txtlist = $scope.dis_block[$scope.dis_block.length-1].txlist;
					if (txtlist.length >0){
						thisblock.txt1 = processtxt(txtlist[0],25);
						if (txtlist.length >1){
							thisblock.txt2 = processtxt(txtlist[1],25);
							if (txtlist.length >2){
								thisblock.txt3 = processtxt(txtlist[2],25);
								if (txtlist.length >3){
									thisblock.txt4 = "...";
								}
							}
						}
					}
					$scope.dis_link.push({
						strokeWidth: 3,
						source: {
							x: $scope.dis_block[$scope.nodeList[i][j].parent.count].x,
							y: $scope.dis_block[$scope.nodeList[i][j].parent.count].y + 55
						},
						target: {
							x: $scope.dis_block[$scope.dis_block.length - 1].x,
							y: $scope.dis_block[$scope.dis_block.length - 1].y - 55
						},
						text: $scope.nodeList[i][j].parent.id,
						degrees: 57.30 * Math.atan2($scope.dis_block[$scope.dis_block.length - 1].y - 110 - $scope.dis_block[$scope.nodeList[i][j].parent.count].y, $scope.dis_block[$scope.dis_block.length - 1].x - $scope.dis_block[$scope.nodeList[i][j].parent.count].x),
						lenlim:0
					});
					if ($scope.dis_link[$scope.dis_link.length - 1].degrees > 90) {
						$scope.dis_link[$scope.dis_link.length - 1].degrees = $scope.dis_link[$scope.dis_link.length - 1].degrees - 180;
					}
					var thislink = $scope.dis_link[$scope.dis_link.length-1];
					thislink.lenlim = Math.ceil(Math.sqrt((thislink.target.x-thislink.source.x)*(thislink.target.x-thislink.source.x)+(thislink.target.y-thislink.source.y)*(thislink.target.y-thislink.source.y))/11.7);
					if (thislink.text != undefined){
						thislink.text = processtxt(thislink.text,thislink.lenlim);
					}
				}
			}
		}
	};
});

notrApp.controller("graphiccontroller", function($scope) {
	var scope = $scope.$parent;

	this.map = function() {
		scope.number = 3;
	};
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
var processtxt = function(tx,num) {
	if (tx.length<num) {
		return tx;
	}
	else {
		return tx.substring(0,num)+" ...";
	}
};