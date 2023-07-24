/**
 * viewer.js
 * Viewer page logic
 * By Nicholas Verrochi and Vidhya Sree N
 * For CS410 - The Axolotl Project
 */

window.onload = () => {
    // get the image url from the search parameters sent by index.html
    const urlParamsString = window.location.search;
    const urlParams = new URLSearchParams(urlParamsString);
    const tileSource = "./data/" + urlParams.get('tileSource') + ".dzi";

    // setup the viewer
    let viewer = new OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        showNavigator: false,
        tileSources: tileSource,
        sequenceMode: false,
        useCanvas: true,
        preventDefaultAction: true
    });

    // Initialize the Grid plugin
    let gridPlugin = new GridViewerPlugin(viewer, {
        conversionFactor: 0.2645833333,
        units: "mm",
        useBuiltInUI: true
    });
    gridPlugin.addGrid();

    // initialize the OSDMeasure plugin
    let plugin = new OSDMeasure(viewer, {
        conversionFactor: 0.2645833333,
        units: "mm",
        useBuiltInUI: true
    });

    // setup annotations
    let annotationHelper = new AnnotationHelper(viewer);
}


