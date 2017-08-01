/**
 * Infovis Project
 * @author Giuseppe Valentino Baldi
 * @author Marco Lorini
 * @author Nicola Sardella
 * 
 * @description crostruzione della clique
 * 
 */
function createGraphCliques(graph, selectedNodesSimilar) {
	
	var cliquesSet = new Set();
	var usersSet = new Set();
	
	// create cliques set
	var array_u2c = LoadFile('frm_1');
	for (var i = 0; i < array_u2c.length; i++) {
		if (array_u2c[i].length > 1 && (selectedNodesSimilar.indexOf(array_u2c[i][0]) != -1)) {
			for (var h = 1; h < array_u2c[i].length; h++) {
				if (array_u2c[i][h].length > 0) {
					cliquesSet.add(array_u2c[i][h]);
				}
			}
		}
	}
	
	// create users set
	var array_c2u = LoadFile('frm_2');
	for (var i = 0; i < array_c2u.length; i++) {
		if (array_c2u[i].length > 1 && (cliquesSet.has(array_c2u[i][0]))) {
			for (var h = 1; h < array_c2u[i].length; h++) {
				if (array_c2u[i][h].length > 0) {
					usersSet.add(array_c2u[i][h]);
				}
			}
		}
	}
	
	// create users node
	var array_follower = LoadFile('frm_3');
	graph.clear();
	for (var i = 0; i < array_follower.length; i++) {
		if (array_follower[i].length > 1 && usersSet.has(array_follower[i][0])) {
			for (var h = 1; h < array_follower[i].length; h++)
				if (array_follower[i][h].length > 0 && usersSet.has(array_follower[i][h]))
					graph.addLink(array_follower[i][0], array_follower[i][h]);
		} else {
			if (array_follower[i][0].length > 0 && usersSet.has(array_follower[i][0]))
				graph.addNode(array_follower[i][0]);
		}
	}
}