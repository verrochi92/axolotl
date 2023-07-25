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
//    const PIXEL_Size = 4.54e-7;

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

    viewer.scalebar({
        type: OpenSeadragon.ScalebarType.MICROSCOPY,
    	pixelsPerMeter: 1 / 4.54e-7,
    	minWidth: "75px",
    	location: OpenSeadragon.ScalebarLocation.BOTTOM_RIGHT,
    	xOffset: 5,
    	yOffset: 10,
    	stayInsideImage: true,
    	color: "rgba(255,255,0,1)",
    	fontColor: "white",
    	backgroundColor: "rgba(0, 0, 0, 0.7)",
    	fontSize: "small",
    	barThickness: 2,
    });

    // Initialize the Grid plugin
    let gridPlugin = new GridViewerPlugin(viewer, {
        conversionFactor: 4.54e-7 * 1e3,
        units: "mm",
        useBuiltInUI: true
    });
    gridPlugin.addGrid();

    // initialize the OSDMeasure plugin
    let plugin = new OSDMeasure(viewer, {
        conversionFactor: 4.54e-7 * 1e3,
        units: "mm",
        useBuiltInUI: true
    });

    // setup annotations
    let annotationHelper = new AnnotationHelper(viewer);
}


