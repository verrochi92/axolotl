/*
    viewer.js
    Logic for the overlay viewer - loads both libraries in one view
    By Nicholas Verrochi
    For CS410 - The Axolotl Project
*/

// used to track which mode the viewer is in
var zoomEnabled = false;
var measurementEnabled = true;
var annotationEnabled = false;

// initialize tools
csTools = cornerstoneTools.init();

var svgNode;

window.onload = function () {
    // create the openseadragon viewer
    let viewer = OpenSeadragon({
        id: "openseadragon-viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../../data/W255B_0.dzi",
        sequenceMode: false,
        useCanvas: true
    });
    let overlay = viewer.svgOverlay()
    svgNode = overlay.node();

    // setup cornerstone image loaders
    cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    cornerstone.registerImageLoader("http", cornerstoneWebImageLoader.loadImage);
    cornerstone.registerImageLoader("https", cornerstoneWebImageLoader.loadImage);
    cornerstone.registerImageLoader("data", cornerstoneWebImageLoader.loadImage);

    // configure tools
    cornerstoneTools.toolStyle.setToolWidth(1);
    cornerstoneTools.toolColors.setToolColor("rgb(255, 255, 0)");
    cornerstoneTools.toolColors.setActiveColor("rgb(255, 255, 0)");

    // enable cornerstone in its element
    let cornerstoneElement = document.getElementById("cornerstone-viewer");
    cornerstone.enable(cornerstoneElement);

    // add tools
    const LengthTool = cornerstoneTools.LengthTool;
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    csTools.addTool(LengthTool);
    csTools.addTool(ArrowAnnotateTool);
    csTools.setToolActive("Length", { mouseButtonMask: 1 });
    csTools.setToolPassive("ArrowAnnotate", { mouseButtonMask: 1 });

    
    // capture the background while tool is active
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL("image/png");
    cornerstone.loadImage(dataURL).then(function (image) {
        cornerstone.displayImage(cornerstoneElement, image);
    });
    
}

// button handlers

function enableZoom() {
    if (measurementEnabled || annotationEnabled) {
        //let cornerstoneContainer = svgNode;
        let cornerstoneContainer = document.getElementById("cornerstone-container");
        cornerstoneContainer.hidden = true;
        // deactive whichever tool is active
        if (measurementEnabled) {
            csTools.setToolPassive("Length", { mouseButtonMask: 1 });
        }
        else {
            csTools.setToolPassive("ArrowAnnotate", { mouseButtonMask: 1 });
        }
    }
    measurementEnabled = annotationEnabled = false;
    zoomEnabled = true;
}

function enableMeasurement() {
    if (annotationEnabled) {
        csTools.setToolPassive("ArrowAnnotate", { mouseButtonMask: 1 });
        csTools.setToolActive("Length", { mouseButtonMask: 1 });
        annotationEnabled = false;
        measurementEnabled = true;
    }
    else if (zoomEnabled) {
        //let cornerstoneContainer = svgNode;
        let cornerstoneContainer = document.getElementById("cornerstone-container");
        cornerstoneContainer.hidden = false;
        csTools.setToolActive("Length", { mouseButtonMask: 1 });
        zoomEnabled = false;
        measurementEnabled = true;
    }
}

function enableAnnotation() {
    if (measurementEnabled) {
        csTools.setToolPassive("Length", { mouseButtonMask: 1 });
        csTools.setToolActive("ArrowAnnotate", { mouseButtonMask: 1 });
        measurementEnabled = false;
        annotationEnabled = true;
    }
    else if (zoomEnabled) {
        //let cornerstoneContainer = svgNode;
        let cornerstoneContainer = document.getElementById("cornerstone-container");
        cornerstoneContainer.hidden = false;
        csTools.setToolActive("ArrowAnnotate", { mouseButtonMask: 1 });
        zoomEnabled = false;
        annotationEnabled = true;
    }
}