/**
 * this demo shows one possible way of implementing "area" selection with webgl
 * renderer
 */
function onLoad() {
var graph = Viva.Graph.graph();

// Construct the graph

createGraph(graph);





var layout = Viva.Graph.Layout.forceDirected(graph, {
    springLength : 10,
    springCoeff : 0.0005,
    dragCoeff : 0.02,
    gravity : -1.2
});


  var graphics = Viva.Graph.View.webglGraphics();

  var renderer = Viva.Graph.View.renderer(graph, {
    layout: layout,
    graphics: graphics,
    container: document.getElementById('graph-container')
  });
  var multiSelectOverlay;

  renderer.run();

  

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
      x: area.x,
      y: area.y -graphTop
    });
      console.log(graphTop);
    var bottomRight = graphics.transformClientToGraphCoordinates({
      x: area.x + area.width,
      y: area.y + area.height-graphTop
    });

    //NODI SELEZIONATI
    var nodesInside =[];

    //SELEZIONA I NODI E LI METTE NELL'ARRAY
    graph.forEachNode(higlightIfInside,nodesInside);

    //DISEGNA
    renderer.rerender();

    return;



  
    function higlightIfInside(node) {
      var nodeUI = graphics.getNodeUI(node.id);
      //var nodesInside =[];
      if (isInside(node.id, topLeft, bottomRight)) {
        nodeUI.color = 0xFFA500ff;
        nodeUI.size = 20;
        nodesInside.push(node.id)
        //console.log(node.id);
      } else {
        nodeUI.color = 0x009ee8ff;
        nodeUI.size = 10;
      }
      
      //document.getElementById("elem").innerHTML = nodesInside.toString();;
    }

  

    function isInside(nodeId, topLeft, bottomRight) {
      var nodePos = layout.getNodePosition(nodeId);
      return (topLeft.x < nodePos.x && nodePos.x < bottomRight.x &&
        topLeft.y < nodePos.y && nodePos.y < bottomRight.y);
    }
  }
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
    x: 0,
    y: 0,
    width: 0,
    height: 0
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
    onAreaSelected: function(cb) {
      notify.push(cb);
    },
    destroy: function () {
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
    selectionIndicator.style.left = selectedArea.x + 'px';
    selectionIndicator.style.top = selectedArea.y + 'px';
    selectionIndicator.style.width = selectedArea.width + 'px';
    selectionIndicator.style.height = selectedArea.height + 'px';
  }
}
