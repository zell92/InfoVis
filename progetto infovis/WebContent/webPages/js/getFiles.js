function getFile(){
	var ret=0;
	var fileFollower = document.getElementById('follower');
	
	var fileSimilar= document.getElementById('similar');

	var fileUsers2Cliques= document.getElementById('users2cliques');

	var fileClique2Users= document.getElementById('cliques2users');
	
	
	if(fileFollower.files.length != 0 && fileSimilar.files.length != 0 && fileUsers2Cliques != 0 && fileClique2Users != 0){
		localStorage.setItem("nodes",fileFollower);
		//window.location.href="./graph1.html";
		var div = document.getElementById('input');
		div.remove();
		var grafo = document.getElementById('grafo');
		grafo.removeAttribute("style");
		ret = 1;
	}
	return ret;
}


