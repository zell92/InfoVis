/**
 * Infovis Project
 * @author Giuseppe Valentino Baldi
 * @author Marco Lorini
 * @author Nicola Sardella
 * 
 * @description caricamento dei file
 * 
 */
function getFile(){
	var ret=0;
	var fileFollower = document.getElementById('follower');
	var fileSimilar= document.getElementById('similar');
	var fileC2uU2c= document.getElementById('c2u_u2c');

	if(fileFollower.files.length != 0 && fileSimilar.files.length != 0 && fileC2uU2c.files.length != 0){
		localStorage.setItem("follower",fileFollower);
		//window.location.href="./thirdGraph.html";
		var div = document.getElementById('input');
		div.style.display = 'none';
		var grafo = document.getElementById('grafo');
		grafo.removeAttribute("style");
		ret = 1;
	}
	return ret;
}


