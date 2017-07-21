function createArraySimilar(){
	var fileInput = document.getElementById('similar');
	var similar= [];

	fileInput.addEventListener('change', function(e) {
		
		var file = fileInput.files[0];
		var textType = /text.*/;
		var nodes;
		
		
		
		if (file.type.match(textType)) {
			
			var reader = new FileReader();

			reader.onload = function(e) {
				var text = reader.result;
				var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks

				for(var i = 0; i < lines.length; i++) {
					nodes = lines[i].split(" ");
					similar.push (nodes);
				}
			}
			reader.readAsText(file);  
		} 
	});
	return similar;
}

