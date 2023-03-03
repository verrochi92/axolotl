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

    // setup tools
    cornerstoneTools.toolStyle.setToolWidth(1);
    cornerstoneTools.toolColors.setToolColor("rgb(255, 255, 0)");
    cornerstoneTools.toolColors.setActiveColor("rgb(255, 255, 0)");

    // enable cornerstone in the viewer
    const element = document.getElementById("cornerstone-element");
    cornerstone.enable(element);

    // add tools and activate length tool
    csTools.addTool(LengthTool);
    csTools.setToolActive('Length', { mouseButtonMask: 1 });
    csTools.addTool(ArrowAnnotateTool)
    csTools.setToolPassive('ArrowAnnotate', { mouseButtonMask: 1 });

    // load and display the image
    cornerstone.loadImage('https://i.imgur.com/wpviULT.jpeg').then(function (image) {
        image.rgba = true;
        cornerstone.displayImage(element, image)

        // load stored data
        let measurementsJson = localStorage.getItem("measurements");
        if (measurementsJson != null) {
            let measurements = JSON.parse(measurementsJson);
            for (let i = 0; i < measurements.data.length; i++) {
                cornerstoneTools.addToolState(element, "Length", measurements.data[i]);
            }
        }
        let annotationsJson = localStorage.getItem("annotations");
        if (annotationsJson != null) {
            let annotations = JSON.parse(annotationsJson);
            for (let i = 0; i < annotations.data.length; i++) {
                cornerstoneTools.addToolState(element, "ArrowAnnotate", annotations.data[i]);
            }
        }
        cornerstoneTools.external.cornerstone.updateImage(element);
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
    annotationsEnabled = !annotationsEnabled;
}

function saveData() {
    let cornerstoneElement = document.getElementById("cornerstone-element");
    let measurements = cornerstoneTools.getToolState(cornerstoneElement, "Length");
    let measurementsJSON = JSON.stringify(measurements);
    localStorage.setItem("measurements", measurementsJSON);
    let annotations = cornerstoneTools.getToolState(cornerstoneElement, "ArrowAnnotate");
    let annotationsJSON = JSON.stringify(annotations);
    localStorage.setItem("annotations", annotationsJSON);
}

function resetData() {
    let cornerstoneElement = document.getElementById("cornerstone-element");
    cornerstoneTools.clearToolState(cornerstoneElement, "Length");
    cornerstoneTools.clearToolState(cornerstoneElement, "ArrowAnnotate");
    cornerstoneTools.external.cornerstone.updateImage(cornerstoneElement);
    localStorage.clear();
}
