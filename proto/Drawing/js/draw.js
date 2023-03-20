window.onload = function() {

var viewer = OpenSeadragon({
  id: "seadragon-viewer",
  prefixUrl: "//openseadragon.github.io/openseadragon/images/",
  tileSources: "../../data/W255B_0.dzi",
});

viewer.initializeAnnotations();

var overlay = viewer.textOverlay();

overlay.node().parentNode.style.pointerEvents = 'none';

}