var graphicModule = angular.module('graphicModule',[]) 
	.controller("datacontroller", function($scope){
		$scope.fun = 1;
		$scope.height = 2000;
		$scope.width = 2000;
		$scope.nodeList = [[{name:"Reading 6: Specifications",
							parent:{},
							text:[]
							}],

							[{name:"Objectives",
							parent:{name:0},
							text:["Understand pre/post conditions in method specs. write correct specs",
									"write tests against a spec",
									"know diff. between checked/unchecked exceptions in Java",
									"how to use exceptions for special results"]
							},

							{name:"Introduction",
							parent:{name:0},
							text:["specs for teamwork. act as contract - implementer responsible for meeting contract, client relies on contract to use method.",
							"pre/post conditions",
							"exceptions"]}],

							[{name:"Specifications",parent:{name:2,id:"Part 1"},text:[]}

							,{name:"Why specs?",parent:{name:3},text:["diff. programmers on a team can have diff. specs in mind","help you find exactly where errors are","reading specs is easier than reading code","implementer has freedom to change implementation w/o telling client","preconditions in specs can rule out expensive checks"]}],

							[{name:"Firewall",parent:{name:4},text:["shield client from details of code","shield implementer from details of usage","decoupling"]},
							
							{name:"Specification Structure",parent:{name:3},text:["preconditions, indicated by keyword requires","postconditions, indicated by keyword effects"]},
							{name:"Exceptions",parent:{name:2,id:"Part 2"},text:[]},
							{name:"Exceptions for signaling bugs",parent:{name:7},text:["exceptions when bugs happen (outside valid range, etc)"]}],
							[{name:"Exceptions for special results",parent:{name:7},text:["exceptions when special things happen"]}]];
		$scope.block = [];
		$scope.link = [];
		$scope.dis_block = [];
		$scope.dis_link = [];
		this.map = function() {
			for (var i = 0; i < $scope.nodeList.length; i++) {
				for (var j = 0; j < $scope.nodeList[i].length; j++) {
					if (i == 0) {$scope.dis_block.push({
						x: $scope.width/2,
						y: 110/2,
						w: 250,
						h: 110,
						color: d3.scale.category10()(9),
						text: $scope.nodeList[i][j].name
					})
				}
					else {
						$scope.dis_block.push({
							x: ((($scope.width-$scope.nodeList[i].length*(250+90)+90)/2)+(250/2)+j*340),
							y: (110+90)*i+(110/2),
							w: 250,
							h: 110,
							color: d3.scale.category10()(9),
							text: $scope.nodeList[i][j].name,
							txlist: $scope.nodeList[i][j].text
						});
						$scope.dis_link.push({
							strokeWidth: 3,
							source: {
								x: $scope.dis_block[$scope.nodeList[i][j].parent.name].x,
								y: $scope.dis_block[$scope.nodeList[i][j].parent.name].y+55
							},
							target: {
								x: $scope.dis_block[$scope.dis_block.length-1].x,
								y: $scope.dis_block[$scope.dis_block.length-1].y-55
							},
							text: $scope.nodeList[i][j].parent.id,
							degrees: 57.30*Math.atan2($scope.dis_block[$scope.dis_block.length-1].y-110-$scope.dis_block[$scope.nodeList[i][j].parent.name].y,$scope.dis_block[$scope.dis_block.length-1].x-$scope.dis_block[$scope.nodeList[i][j].parent.name].x)
						});
						if ($scope.dis_link[$scope.dis_link.length-1].degrees>90) {
							$scope.dis_link[$scope.dis_link.length-1].degrees = $scope.dis_link[$scope.dis_link.length-1].degrees-180;
						}
					}
				}
			}	

			for(var i1=0; i1<10;i1++) {console.log( $scope.dis_block[i1].text);}
		};
	})
	.controller("graphiccontroller",function($scope){
		var scope = $scope.$parent;
		
		this.map = function() {
			scope.number = 3;
		};
	});

	/* {strokeWidth: 2,
		source: { x: 10,
				  y: 10
				},
		target: {
				  x: 30,
				  y:30
				},
		text: "this is a test"
	   }
	   {x:200,
	   	y:200,
	   	text: "this is a test"}

	   	{x:30,
	   	y:30,
	   	w: 10,
	   	h:10,
	   	color: d3.scale.category10()(0),
	   	text: "this is a test"},
	   	{x:50,
	   	y:50,
	   	w: 10,
	   	h:10,
	   	color: d3.scale.category10()(0),
	   	text: "this is a fucking test"}*/
	



