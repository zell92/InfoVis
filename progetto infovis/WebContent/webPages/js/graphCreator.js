function createGraph(graph){
	var fileInput = document.getElementById('follower');

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;
		var nodes;
		graph.clear();
		if (file.type.match(textType)) {
			var reader = new FileReader();

			reader.onload = function(e) {

				var text = reader.result;

				var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks

				for(var i = 0; i < lines.length; i++) {
					nodes = lines[i].split(" ");
					if (nodes.length>1){
						for(var h=1;h<nodes.length;h++)
							if(nodes[h].length>0)
								graph.addLink(nodes[0],nodes[h]);
					}else{
						if(nodes[0].length>0)
							graph.addNode(nodes[0]);}
				}
			}
			reader.readAsText(file);  
		} 
	});

}

