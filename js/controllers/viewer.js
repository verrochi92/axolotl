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
        showNavigator: false,
        tileSources: tileSource,
        sequenceMode: false,
        useCanvas: true
    });

    // initialize the plugin
    plugin = new OSDMeasureAndAnnotate(viewer, 4.54e-1, "um");

    // dispatch correct method on key press
    document.addEventListener('keydown', (event) => {
        // start measuring
        if (event.key == 'm') {
            if (plugin.mode != plugin.Modes.MEASURE) {
                plugin.toggleMeasuring();
            }
        }
        // stop measuring
        else if (event.key == 'q') {
            if (plugin.mode == plugin.Modes.MEASURE) {
                plugin.toggleMeasuring();
            }
        }
        else if (event.key == 'r') {
            if (window.confirm("Are you sure you want to reset all measurements and annotations?")) {
                plugin.clear();
            }
        }
        else if (event.ctrlKey && event.key == 'z') {
            plugin.undo();
        }
        else if (event.ctrlKey && event.key == 'y') {
            plugin.redo();
        }
        else if (event.ctrlKey && event.key == 'e') {
            plugin.exportCSV();
        }
        event.preventDefault();
    });

    // set color of the color input to match that of the plugin
    let colorSelector = document.getElementById("measurement-color");
    colorSelector.value = plugin.color;
}

function setColor() {
    colorSelector = document.getElementById("measurement-color");
    plugin.setMeasurementColor(colorSelector.value);
}


