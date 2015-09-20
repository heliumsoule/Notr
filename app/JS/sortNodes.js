function sortNodes(nodeList) {
	var node;
	// Create an array of arrays of nodes
	var sortedNodes = [];

	while (nodeList.length > 0) {
		for (var i=0; i < nodeList.length; i++) {
			node = nodeList[i];

			// Find & sort the head node (tier = 0)
			if (node.parent.name == undefined) {
				nodeList.splice(i,1);
				sortedNodes[0] = [node];
			}

			// All other nodes (tier > 0)
			else {
				// Check each node that is already sorted,
				// to see if it's a parent of the node we're checking.
				for (var x; x < sortedNodes.length; x++) {
					var array = sortedNodes[x];
					for (var parent in array) {
						// We found the parent!
						if (node.parent.name == parent.name) {
							// Case 1: we don't have an array for that tier yet.
							if (sortedNodes[x+1] == undefined) {
								sortedNodes[x+1] = [node];
							}
							// Case 2: we have an array for that tier already.
							else {
								sortedNodes[x+1].push(node);
							}
							// Remove node from nodeList
							nodeList.splice(i,1);
						}
					}
				}
			}
		}
	}
	return sortedNodes;
}