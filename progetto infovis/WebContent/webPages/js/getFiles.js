function getFile(){
	var ret=0;
	var fileFollower = document.getElementById('follower');
	
	var fileSimilar= document.getElementById('similar');
	
	
	if(fileFollower.files.length != 0 && fileSimilar.files.length!=0){
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


