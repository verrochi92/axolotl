/**
 * viewer.js
 * Viewer page logic
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project
 */

var plugin; // stores the OSDMeasureAndAnnotate plugin

window.onload = () => {
    // get the image url from the search parameters sent by index.html
    const urlParamsString = window.location.search;
    const urlParams = new URLSearchParams(urlParamsString);
    const tileSource = "./data/" + urlParams.get('tileSource') + ".dzi";

    // setup the viewer
    let viewer = new OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        showNavigator: true,
        tileSources: tileSource,
        sequenceMode: false,
        zoomInButton: "zoom-in-button",
        zoomOutButton: "zoom-out-button"
    });

    // initialize the plugin
    plugin = new OSDMeasureAndAnnotate(viewer);

    // set up undo and redo features
    let undoButton = document.getElementById("undo-button");
    let redoButton = document.getElementById("redo-button");
    // if no measurements stored, disable the undo button
    if (plugin.measurements.length == 0) {
        undoButton.disabled = true;
    }
    // if no undone items stored, disable the redo button
    if (plugin.redoStack.length == 0) {
        redoButton.disabled = true;
    }
    // re-enable undo button after a measurement
    viewer.addHandler('canvas-double-click', () => {
        if (plugin.measurements.length > 0 || plugin.isMeasuring) {
            undoButton.disabled = false;
            // since we made a new measurement, we need to disable the redo button
            redoButton.disabled = true; 
        }
    })
}

function measureButton() {
    // toggle measuring in the plugin
    plugin.toggleMeasuring();
    // get buttons 
    let zoomInButton = document.getElementById("zoom-in-button");
    let zoomOutButton = document.getElementById("zoom-out-button");
    let measureButton = document.getElementById("measure-button");
    let undoButton = document.getElementById("undo-button");
    let optionsSpan = document.getElementById("options");
    // based on plugin's mode, disable or re-enable other buttons
    if (plugin.mode == plugin.Modes.MEASURE) {
        // disable zoom and set text in measure button
        zoomInButton.disabled = true;
        zoomOutButton.disabled = true;
        measureButton.value = "Stop Measuring";
        // display measurement options while measuring
        optionsSpan.removeAttribute("hidden");
    } else {
        // restore buttons as measuring stopped
        zoomInButton.disabled = false;
        zoomOutButton.disabled = false;
        measureButton.value = "Measure";
        // disable undo if needed
        if (plugin.measurements.length == 0) {
            undoButton.disabled = true;
        }
        optionsSpan.hidden = "hidden";
    }
}

function resetButton() {
    if (window.confirm("Are you sure you want to reset all measurements and annotations?")) {
        plugin.clear();
    }
}

function undoButton() {
    plugin.undo();
    if (plugin.measurements.length == 0 && !plugin.isMeasuring) {
        document.getElementById("undo-button").disabled = true;
    }
    // re-enable the redo button if there has been a successful undo
    console.log("redoStack.length = " + plugin.redoStack.length);
    if (plugin.redoStack.length > 0) {
        document.getElementById("redo-button").disabled = false;
    }
}

function redoButton() {
    plugin.redo();
    if (plugin.redoStack.length == 0) {
        document.getElementById("redo-button").disabled = true;
    }
    if (plugin.measurements.length > 0) {
        document.getElementById("undo-button").disabled = false;
    }
}

function setColor() {
    colorSelector = document.getElementById("measurement-color");
    plugin.setMeasurementColor(colorSelector.value);
}

