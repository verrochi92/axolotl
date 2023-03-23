window.onload = function() {

var viewer = OpenSeadragon({
  id: "seadragon-viewer",
  prefixUrl: "//openseadragon.github.io/openseadragon/images/",
  tileSources: "../../data/W255B_0.dzi"
});

    var anno = OpenSeadragon.Annotorious(viewer);
    // Load annotations in W3C WebAnnotation format
    anno.loadAnnotations('annotations.w3c.json');

}