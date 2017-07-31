function createGraphCliques(graph, selectedNodesSimilar) {
	var fileInput = localStorage.getItem("follower");
	//document.getElementById('follower');
	var users2cliquesFile = localStorage.getItem("users2cliques");
	//document.getElementById('users2cliques');
	var cliques2usersFile = localStorage.getItem("cliques2users");
	//document.getElementById('cliques2users');

	var cliquesSet = new Set();
	var usersSet = new Set();
	// create cliques set
	
	var file = users2cliquesFile;
	var textType = /text.*/;
	var row;
	
	
	if (file.type.match(textType)) {
		var reader = new FileReader();
		alert("god");
		reader.onload = function(e) {

			var text = reader.result;

			var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks

			for (var i = 0; i < lines.length; i++) {
				row = lines[i].split(" ");
				if (row.length > 1 && (selectedNodesSimilar.indexOf(row[0]) != -1)) {
					for (var h = 1; h < row.length; h++) {
						if (row[h].length > 0) {
							cliquesSet.add(row[h]);
						}
					}
				}
			}
		}
		reader.readAsText(file);
	}


	// create users set

	file = cliques2usersFile;
	if (file.type.match(textType)) {
		var reader = new FileReader();

		reader.onload = function(e) {

			var text = reader.result;

			var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks

			for (var i = 0; i < lines.length; i++) {
				row = lines[i].split(" ");
				if (row.length > 1) {
					for (var h = 1; h < row.length; h++) {
						if (row[h].length > 0) {
							usersSet.add(row[h]);
						}
					}
				}
			}
		}
		reader.readAsText(file);
	}


	// create users node
	file = fileInput;
	graph.clear();
	if (file.type.match(textType)) {
		var reader = new FileReader();

		reader.onload = function(e) {

			var text = reader.result;

			var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks

			for (var i = 0; i < lines.length; i++) {
				row = lines[i].split(" ");
				if (row.length > 1 && usersSet.has(row[0])) {
					for (var h = 1; h < row.length; h++)
						if (row[h].length > 0 && usersSet.has(row[h]))
							graph.addLink(row[0], row[h]);
				} else {
					if (row[0].length > 0 && usersSet.has(row[0]))
						graph.addNode(row[0]);
				}
			}
		}
		reader.readAsText(file);
	}

}