/**
 * viewer.js
 * Viewer page logic
 * By Vidhya Sree Narayanappa
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
        showNavigator: false,
        tileSources: tileSource,
        sequenceMode: false,
        useCanvas: true,
    });

    // initialize the plugin
    plugin = new OSDMeasureAndAnnotate(viewer, 4.54e-1, "um");

        const measureShortcut = (event) => {
            if (event.key === 'm') {
                measureButton();
                event.preventDefault();
            }
        };
        const stopMeasureShortcut = (event) => {
              if (event.key === 'q') {
                  stopMeasureButton();
                  event.preventDefault();
              }
        };
        const resetShortcut = (event) => {
            if (event.key === 'r') {
                resetButton();
                event.preventDefault();
            }
        };
        const undoShortcut = (event) => {
            if (event.ctrlKey && event.key === 'z') {
                undoButton();
                event.preventDefault();
            }
        };
        const redoShortcut = (event) => {
            if (event.ctrlKey && event.key === 'y') {
                redoButton();
                event.preventDefault();
            }
        };

        document.addEventListener('keydown', measureShortcut);
        document.addEventListener('keydown', resetShortcut);
        document.addEventListener('keydown', undoShortcut);
        document.addEventListener('keydown', redoShortcut);
        document.addEventListener('keydown', stopMeasureShortcut);
}

function measureButton() {

    plugin.measure();
}
function stopMeasureButton() {
        plugin.stopMeasuring();
}

function resetButton() {
    if (window.confirm("Are you sure you want to reset all measurements and annotations?")) {
        plugin.clear();
    }
}

function undoButton() {
    plugin.undo();
}

function redoButton() {
    plugin.redo();
}

function setColor() {
    colorSelector = document.getElementById("measurement-color");
    plugin.setMeasurementColor(colorSelector.value);
}


