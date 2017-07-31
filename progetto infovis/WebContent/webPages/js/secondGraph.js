
//ARRAY DI ARRAY DEI NODI SIMILI
var similar = JSON.parse(localStorage.getItem("nodesSimilar"));
//ARRAY DEI NODI SELEZIONATI NELLA PAGINA PRECEDENTE
var selectedNodes = JSON.parse(localStorage.getItem("nodesInside"));
//MAPPA DEI SIMILI (NODO: ARRAYE DEI SIMILI) INIZIALMENTE VUOTA
var mapSimilar= new Map();
//ARRAY DELLE COPPIE DA INSERIRE NEL SECONDO GRAFO
var graphArray=[];

// variabile per l'evento click
var bool = 0;
var oldNode = -1;
var blueColor = "#009ee8ff";
var orangeColor = "#FFA500ff";

//Instantiate a slider
var slider = new Slider('#barra', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});

function onLoad(){


	//GENERO LA MAPPA DEI SIMILI
	arrayToMap();
	console.log(mapSimilar.size);
	//GENERO L'ARRAY DELLE COPPIE DI NODI DA INSERIRE NEL SECONDO GRAFO
	var k = slider.getValue();
	getKSimilar(k,graphArray);
	//alert(mapSimilar.size);

//DISEGNO IL GRAFO
	var graph = Viva.Graph.graph();
	graph.clear();
	
	selectedNodes.forEach(function(entry){
		graph.addNode(entry);
	});
	graphArray.forEach(function(entry) {
		graph.addLink(entry[0],entry[1]);
	});
	
	var layout = Viva.Graph.Layout.forceDirected(graph, {
		springLength : 100,
		springCoeff : 0.0001,
		dragCoeff : 0.05,
		gravity : -1.2,
		timeStep : 10,
	    stableThreshold: 0.1
	});

	var graphics = Viva.Graph.View.webglGraphics();


	// event interaction : add children node.
	var events = Viva.Graph.webglInputEvents(graphics, graph);

	// change size
	events.click( function (node){
		var userid = document.getElementById('userID');
		if (bool==0){
			// node
			var nodeUI = graphics.getNodeUI(node.id);
			nodeUI.size = 20;
			userid.innerHTML = "User ID: "+node.id;
			if(nodeUI.color == 0xFFA500ff){
				userid.style.color = orangeColor;
			}
			else{
				userid.style.color = blueColor;
			}
			userid.style.visibility = 'visible';
			bool = 1;
			oldNode = node.id;

			// link
			graph.forEachLinkedNode(node.id, function(node, link){
		        var linkUI = graphics.getLinkUI(link.id);
		        linkUI.color = nodeUI.color;
		    });
		}else if(node.id !== oldNode){
			// node
			var oldNodeUI = graphics.getNodeUI(oldNode);
			var nodeUI = graphics.getNodeUI(node.id);
			oldNodeUI.size = 10;
			nodeUI.size = 20;
			userid.innerHTML = "User ID: "+node.id;
			if(nodeUI.color == 0xFFA500ff){
				userid.style.color = orangeColor;
			}
			else{
				userid.style.color = blueColor;
			}
			userid.style.visibility = 'visible';

			// link
			graph.forEachLinkedNode(oldNode, function(node, link){
		        var linkUI = graphics.getLinkUI(link.id);
		        linkUI.color = 3014898687;
		    });
		    graph.forEachLinkedNode(node.id, function(node, link){
		        var linkUI = graphics.getLinkUI(link.id);
		        linkUI.color = nodeUI.color;
		    });

		    oldNode = node.id;
		}
		else{
			// node
			var nodeUI = graphics.getNodeUI(node.id);
			nodeUI.size = 10;
			userid.style.visibility = 'hidden';
			bool = 0;
			oldNode = -1;

			// link
			graph.forEachLinkedNode(node.id, function(node, link){
		        var linkUI = graphics.getLinkUI(link.id);
		        linkUI.color = 3014898687;
		    });
		}
	});
	

	var renderer = Viva.Graph.View.renderer(graph, {
		layout: layout,
		graphics: graphics,
		container: document.getElementById('graph-container')
	});

	renderer.run();
	graph.forEachNode(function(node){
		if(selectedNodes.indexOf(node.id)>=0){
			var nodeUI = graphics.getNodeUI(node.id);
			nodeUI.color = 0xFFA500ff;

		}

	});
	renderer.rerender();
	
	
//MODIFICO IL GRAFO SE CAMBIO K	
	slider.on('slideStop', function(){
		var newValue = slider.getValue();
		if(newValue!=k){
			k=newValue;
			graph.clear();
			graphArray=[];
			getKSimilar(k,graphArray);
			graphArray.forEach(function(entry) {
				graph.addLink(entry[0],entry[1]);
			});
			selectedNodes.forEach(function(entry){
				graph.addNode(entry);
			});
			graph.forEachNode(function(node){
				if(selectedNodes.indexOf(node.id)>=0){
					var nodeUI = graphics.getNodeUI(node.id);
					nodeUI.color = 0xFFA500ff;

				}

			});
			renderer.rerender();

		}

	});


}

//FUNZIONE PER CREARE LA MAPPA DEI SIMILI
function arrayToMap(){
	for (var i = 0; i<similar.length; i++){

		var nodes = similar[i];
		var key = nodes[0];
		mapSimilar.set(key,nodes.slice(1));
	}
}

//FUNZIONE PER GENERARE L'ARRAY DEI NODI SIMILI DA INSERIRE NEL GRAFO PER I PRIMI K SIMILI
function getKSimilar(k,graphArray){
	mapSimilar.forEach(function (item, key, mapObj) {  
		//item = arrey dei simili
		//key � la chiave
		if(selectedNodes.indexOf(key)>=0){
			//console.log("chiave valida:"+key);

			//CALCOLO LA LUNGHEZZA DELL'ITERAZIONE SUI SIMILI
			var iter = k;
			if (item.length<k)
				iter= item.length;

			//ITERO SUI SIMILI
			for (var i = 0; i<iter; i++){
				console.log(key);
				console.log(item);
				var array=mapObj.get(item[i]);
				if(array.indexOf(key)>=0 &&array.indexOf(key)<k){
					//salvo la coppia di nodi
					var elem = [key,item[i]];
					//console.log(elem);
					graphArray.push(elem);
				}
			}
		}
	});  
}

// FUNZIONE PER VISUALIZZARE LE CLIQUES DEI NODI SELEZIONATI PER LA SIMILARIT�
function sendSelectedNodes(){
	//localStorage.setItem("nodesInside",localStorage.getItem("nodesInside"));
	window.location.href = "./thirdGraph.html";
}

