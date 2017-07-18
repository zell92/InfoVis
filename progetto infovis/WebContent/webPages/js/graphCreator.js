function createGraph(graph){
	var fileInput = document.getElementById('fileInput');
	
	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;
		graph.clear();
		if (file.type.match(textType)) {
			var reader = new FileReader();

			reader.onload = function(e) {

				var text = reader.result;

				var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
				
				for(var i = 0; i < lines.length; i++) {
					graph.addNode(lines[i]);
				}
			}

			reader.readAsText(file);  
		} 
	});
	/*graph.addNode('anvaka', {url : 'https://secure.gravatar.com/avatar/91bad8ceeec43ae303790f8fe238164b'});
	    graph.addNode('manunt', {url : 'https://secure.gravatar.com/avatar/c81bfc2cf23958504617dd4fada3afa8'});
	    graph.addNode('thlorenz', {url : 'https://secure.gravatar.com/avatar/1c9054d6242bffd5fd25ec652a2b79cc'});
	    graph.addNode('bling', {url : 'https://secure.gravatar.com/avatar/24a5b6e62e9a486743a71e0a0a4f71af'});
	    graph.addNode('diyan', {url : 'https://secure.gravatar.com/avatar/01bce7702975191fdc402565bd1045a8?'});
	    graph.addNode('pocheptsov', {url : 'https://secure.gravatar.com/avatar/13da974fc9716b42f5d62e3c8056c718'});
	    graph.addNode('dimapasko', {url : 'https://secure.gravatar.com/avatar/8e587a4232502a9f1ca14e2810e3c3dd'});

	    graph.addNode('aaaa', {url : 'https://secure.gravatar.com/avatar/8e587a4232502a9f1ca14e2810e3c3dd'});
	    graph.addNode('bbbb', {url : 'https://secure.gravatar.com/avatar/8e587a4232502a9f1ca14e2810e3c3dd'});

	    graph.addLink('anvaka', 'manunt');
	    graph.addLink('anvaka', 'thlorenz');
	    graph.addLink('anvaka', 'bling');
	    graph.addLink('anvaka', 'diyan');
	    graph.addLink('anvaka', 'pocheptsov');
	    graph.addLink('anvaka', 'dimapasko');

	 */

}

