/**
 * viewer.js
 * Viewer page logic
 * By Nicholas Verrochi and Vidhya Sree N
 * For CS410 - The Axolotl Project
 */

var plugin; // stores the OSDMeasureAndAnnotate plugin
var measurementListElements = []; // measurements to display
var gridPlugin; // gridplugin


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
    gridPlugin = new GridViewerPlugin(viewer);
    gridPlugin.addGrid();

    // initialize the plugin
    plugin = new OSDMeasure(viewer, {
        conversionFactor: 4.54e-1,
        units: "um",
        useBuiltInUI: true
    });
}


