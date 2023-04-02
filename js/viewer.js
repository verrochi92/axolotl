/*
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
    const tileSource = "./data/" + urlParams.get('tileSource') + ".dzi"

    // setup the viewer
    let viewer = new OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        showNavigator: true,
        tileSources: tileSource,
        sequenceMode: false,
        zoomInButton: "zoom-in-button",
        zoomOutButton: "zoom-out-button"
    })

    // initialize the plugin
    plugin = new OSDMeasureAndAnnotate(viewer);
}

function measureButton() {
    // toggle measuring in the plugin
    plugin.toggleMeasuring();
    // get buttons
    let zoomInButton = document.getElementById("zoom-in-button");
    let zoomOutButton = document.getElementById("zoom-out-button");
    let measureButton = document.getElementById("measure-button");
    // based on plugin's mode, disable or re-enable other buttons
    if (plugin.mode == plugin.Modes.MEASURE) {
        zoomInButton.disabled = true;
        zoomOutButton.disabled = true;
        measureButton.value = "Stop Measuring";
    } else {
        zoomInButton.disabled = false;
        zoomOutButton.disabled = false;
        measureButton.value = "Measure";
    }   
}