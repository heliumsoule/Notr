function sortNodes(nodeList) {
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
	return sortedNotes;
}