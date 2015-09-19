function sortNodes(nodeList) {
	var node;
	// Create an array of arrays of nodes
	var sortedNodes = [];

	while (nodeList.length > 0) {
		for (i=0; i < nodeList.length; i++) {
			node = nodeList[i];

			// Find & sort the head node (tier = 0)
			if (node.parent.name == undefined) {
				node.tier = 0;
				nodeList.splice(i,1);
				sortedNodes[0] = [node];
			}

			// All other nodes (tier > 0)
			else {
				// If the parent hasn't been assigned a tier yet, skip it;
				// we'll come back to it through the while loop.
				if node.parent.tier == undefined {
					continue;
				}

				// Assign the node's tier
				else {
					node.tier = node.parent.tier + 1;
					nodeList.splice(i,1);

					// An array for the specific tier does not exist,
					// so make the array and add the node.
					if (sortedNodes[node.tier] == undefined) {
						sortedNodes[node.tier] = [node];
					}

					// An array for the specific tier exists so add the node
					else {
						sortedNodes[node.tier].push(node);
					}
				}
			}
		}
	}
	return sortedNodes;
}