function getFile(){

	var fileInput = document.getElementById('fileInput');

	if(fileInput.files.length != 0 ){
		localStorage.setItem("nodes",fileInput);
		//window.location.href="./graph1.html";
		var div = document.getElementById('input');
		div.remove();
		var grafo = document.getElementById('grafo');
		grafo.removeAttribute("style");
	}

}