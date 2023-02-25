/**
 * viewer-cornerstone.js
 * 
 * Prototype of the Cornerstone viewer 
 * with annotation and measurement tools
 * 
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project 
 */

var annotationsEnabled = false; 
const csTools = cornerstoneTools.init()
const LengthTool = cornerstoneTools.LengthTool;
const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;

// setting up cornerstone on page load
window.onload = function () {
    // setup image loaders
    cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    cornerstone.registerImageLoader('http', cornerstoneWebImageLoader.loadImage);
    cornerstone.registerImageLoader('https', cornerstoneWebImageLoader.loadImage);
    cornerstone.registerImageLoader('data', cornerstoneWebImageLoader.loadImage);

    // initialize tools and enable cornerstone in the viewer
    cornerstoneTools.toolStyle.setToolWidth(1);
    cornerstoneTools.toolColors.setToolColor("rgb(255, 255, 0)");
    cornerstoneTools.toolColors.setActiveColor("rgb(255, 255, 0)");

    const element = document.getElementById("cornerstone-element");
    cornerstone.enable(element);

    // add tools and activate length tool
    csTools.addTool(LengthTool);
    csTools.setToolActive('Length', { mouseButtonMask: 1 });
    csTools.addTool(ArrowAnnotateTool)
    csTools.setToolPassive('ArrowAnnotate', { mouseButtonMask: 1 });

    cornerstone.loadImage('https://i.imgur.com/wpviULT.jpeg').then(function (image) {
        var img = image;
        img.rgba = true;
        cornerstone.displayImage(element, img)
    });
}

function toggleTools() {
    if (annotationsEnabled) {
        csTools.setToolPassive('ArrowAnnotate', { mouseButtonMask: 1 });
        csTools.setToolActive('Length', { mouseButtonMask: 1 });
        document.getElementById("toggle-button").value = "Switch to Annotation";
    }
    else {
        csTools.setToolPassive('Length', { mouseButtonMask: 1 });
        csTools.setToolActive('ArrowAnnotate', { mouseButtonMask: 1 });
        document.getElementById("toggle-button").value = "Switch to Measuring";
    }
    annotationsEnabled = !annotationsEnabled
}
