/**
 * Infovis Project
 * @author Giuseppe Valentino Baldi
 * @author Marco Lorini
 * @author Nicola Sardella
 * 
 * @description gestione per la terza schermata
 * 
 */
var selectedNodes = [];
//nodi selezionati e simili
var nodeCliques = JSON.parse(localStorage.getItem("nodeCliques"));

//ARRAY DEI NODI SELEZIONATI PER LA SIMILARITÀ
var selectedNodesSimilar = JSON.parse(localStorage.getItem("nodesInside"));

//OFFSET PER LA PARTE SUPERIORE
var offset = 70;
//OFFSET PER LA PARTE LATERALE
var body = document.getElementsByTagName("BODY")[0];
var style = window.getComputedStyle(body);
var marginLeft = parseFloat(style.getPropertyValue('margin-left'));
var offsetSide = marginLeft;

// variabile per l'evento click
var bool = 0;
var oldNode = -1;
var blueColor = "#009ee8ff";
var orangeColor = "#FFA500ff";

function onLoad() {
	var graph = Viva.Graph.graph();

	//	Construct the graph

	createGraphCliques(graph, selectedNodesSimilar);

	var layout = Viva.Graph.Layout.forceDirected(graph, {
		springLength : 100,
		springCoeff : 0.0001,
		dragCoeff : 0.05,
		gravity : -1.2,
		timeStep : 10,
		stableThreshold : 0.1
	});

	var graphics = Viva.Graph.View.webglGraphics();

	// event interaction : add children node.
	var events = Viva.Graph.webglInputEvents(graphics, graph);
	// change color
	// change size
	events.click(function(node) {
		var userid = document.getElementById('userID');
		if (bool == 0) {
			// node
			var nodeUI = graphics.getNodeUI(node.id);
			nodeUI.size = 20;
			userid.innerHTML = "User ID: " + node.id;
			if (nodeUI.color == 0xFFA500ff) {
				userid.style.color = orangeColor;
			} else {
				userid.style.color = blueColor;
			}
			userid.style.visibility = 'visible';
			bool = 1;
			oldNode = node.id;

			// link
			graph.forEachLinkedNode(node.id, function(node, link) {
				var linkUI = graphics.getLinkUI(link.id);
				linkUI.color = nodeUI.color;
			});
		} else if (node.id !== oldNode) {
			// node
			var oldNodeUI = graphics.getNodeUI(oldNode);
			var nodeUI = graphics.getNodeUI(node.id);
			oldNodeUI.size = 10;
			nodeUI.size = 20;
			userid.innerHTML = "User ID: " + node.id;
			if (nodeUI.color == 0xFFA500ff) {
				userid.style.color = orangeColor;
			} else {
				userid.style.color = blueColor;
			}
			userid.style.visibility = 'visible';

			// link
			graph.forEachLinkedNode(oldNode, function(node, link) {
				var linkUI = graphics.getLinkUI(link.id);
				linkUI.color = 3014898687;
			});
			graph.forEachLinkedNode(node.id, function(node, link) {
				var linkUI = graphics.getLinkUI(link.id);
				linkUI.color = nodeUI.color;
			});

			oldNode = node.id;
		} else {
			// node
			var nodeUI = graphics.getNodeUI(node.id);
			nodeUI.size = 10;
			userid.style.visibility = 'hidden';
			bool = 0;
			oldNode = -1;

			// link
			graph.forEachLinkedNode(node.id, function(node, link) {
				var linkUI = graphics.getLinkUI(link.id);
				linkUI.color = 3014898687;
			});
		}
	});

	var renderer = Viva.Graph.View.renderer(graph, {
		layout : layout,
		graphics : graphics,
		container : document.getElementById('graph-container')
	});
	var multiSelectOverlay;
	renderer.run();

console.log(nodeCliques);
    graph.forEachNode(function(node) {
		if (nodeCliques.indexOf(node.id) >= 0) {
        console.log(node.id);
			var nodeUI = graphics.getNodeUI(node.id);
			nodeUI.color = 0xFFA500ff;
		}

	});
	renderer.rerender();


	document.addEventListener('keydown', function(e) {
		if (e.which === 16 && !multiSelectOverlay) { // shift key
			multiSelectOverlay = startMultiSelect(graph, renderer, layout);
		}
	});
	document.addEventListener('keyup', function(e) {
		if (e.which === 16 && multiSelectOverlay) {
			multiSelectOverlay.destroy();
			multiSelectOverlay = null;
		}
	});
}


function startMultiSelect(graph, renderer, layout) {
	var graphics = renderer.getGraphics();
	var domOverlay = document.querySelector('.graph-overlay');
	var overlay = createOverlay(domOverlay);
	overlay.onAreaSelected(handleAreaSelected);
	
	return overlay;

	function handleAreaSelected(area) {
		// For the sake of this demo we are using silly O(n) implementation.
		// Could be improved with spatial indexing if required.
		var graphTop = document.getElementById('graph-container').offsetTop;

		
		var topLeft = graphics.transformClientToGraphCoordinates({
			x : area.x - (offsetSide * 2),
			y : area.y - offset - graphTop
		});
		var bottomRight = graphics.transformClientToGraphCoordinates({
			x : area.x + area.width - (offsetSide * 2),
			y : area.y + area.height - offset - graphTop
		});

		//NODI SELEZIONATI
		var nodesInside = [];

		//SELEZIONA I NODI E LI METTE NELL'ARRAY
		graph.forEachNode(higlightIfInside, nodesInside);
		selectedNodes = nodesInside;
		//DISEGNA
		renderer.rerender();

		return;

		function higlightIfInside(node) {
			
			var nodeUI = graphics.getNodeUI(node.id);
			if (isInside(node.id, topLeft, bottomRight)) {
				nodeUI.color = 0xFFA500ff;
				nodeUI.size = 20;
				nodesInside.push(node.id)
			} else {
				if (nodeCliques.indexOf(node.id)==-1) {
					nodeUI.color = 0x009ee8ff;

				}
                if(node.id!=oldNode)
                	nodeUI.size = 10;
			}
			var button = document.getElementById('sendCluster');
			if (nodesInside.length == 0) {

				button.style.visibility = 'hidden';
			} else {
				button.style.visibility = 'visible';
			}
		}

		function isInside(nodeId, topLeft, bottomRight) {
			var nodePos = layout.getNodePosition(nodeId);
			return (topLeft.x < nodePos.x && nodePos.x < bottomRight.x &&
				topLeft.y < nodePos.y && nodePos.y < bottomRight.y);
		}
	}
}

function sendNodes() {
	localStorage.setItem("nodesInside",JSON.stringify(selectedNodes));
	window.location.href = "./secondGraph.html";
}

function createOverlay(overlayDom) {

	var selectionClasName = 'graph-selection-indicator';
	var selectionIndicator = overlayDom.querySelector('.' + selectionClasName);
	if (!selectionIndicator) {
		selectionIndicator = document.createElement('div');
		selectionIndicator.className = selectionClasName;
		overlayDom.appendChild(selectionIndicator);
	}

	var notify = [];
	var dragndrop = Viva.Graph.Utils.dragndrop(overlayDom);
	var selectedArea = {
		x : 0,
		y : 0,
		width : 0,
		height : 0
	};
	var startX = 0;
	var startY = 0;

	dragndrop.onStart(function(e) {
		startX = selectedArea.x = e.clientX;
		startY = selectedArea.y = e.clientY;
		selectedArea.width = selectedArea.height = 0;

		updateSelectedAreaIndicator();
		selectionIndicator.style.display = 'block';
	});

	dragndrop.onDrag(function(e) {
		recalculateSelectedArea(e);
		updateSelectedAreaIndicator();
		notifyAreaSelected();
	});

	dragndrop.onStop(function() {
		selectionIndicator.style.display = 'none';
	});

	overlayDom.style.display = 'block';

	return {
		onAreaSelected : function(cb) {
			notify.push(cb);
		},
		destroy : function() {
			overlayDom.style.display = 'none';
			dragndrop.release();
		}
	};

	function notifyAreaSelected() {
		notify.forEach(function(cb) {
			cb(selectedArea);
		});
	}

	function recalculateSelectedArea(e) {
		selectedArea.width = Math.abs(e.clientX - startX);
		selectedArea.height = Math.abs(e.clientY - startY);
		selectedArea.x = Math.min(e.clientX, startX);
		selectedArea.y = Math.min(e.clientY, startY);
	}

	function updateSelectedAreaIndicator() {
		selectionIndicator.style.left = selectedArea.x - offsetSide + 'px';
		selectionIndicator.style.top = selectedArea.y - offset + 'px';
		selectionIndicator.style.width = selectedArea.width + 'px';
		selectionIndicator.style.height = selectedArea.height + 'px';
	}
}