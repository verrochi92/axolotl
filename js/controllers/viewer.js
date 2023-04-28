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

    // add menus as children to the viewer so they display in fullscreen
    let viewerElement = document.getElementById("viewer");
    let menuIcon = document.getElementById("menu-icon");
    let measurementMenu = document.getElementById("measurement-menu");

    viewerElement.appendChild(document.getElementById("shortcuts"));
    viewerElement.appendChild(menuIcon);
    viewerElement.appendChild(measurementMenu);

    // display menu when menu icon is clicked
    menuIcon.addEventListener("click", () => {
        // display if not open
        if (measurementMenu.getAttribute("hidden") == "hidden") {
            measurementMenu.removeAttribute("hidden");
        }
        // otherwise close it
        else {
            measurementMenu.setAttribute("hidden", "hidden");
        }
    })

    // dispatch correct method on key press
    document.addEventListener('keydown', (event) => {
        console.log("keydown");
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
        // reset
        else if (event.key == 'r') {
            if (window.confirm("Are you sure you want to reset all measurements and annotations?")) {
                plugin.clear();
            }
        }
        // undo
        else if (event.ctrlKey && event.key == 'z') {
            plugin.undo();
        }
        // redo
        else if (event.ctrlKey && event.key == 'y') {
            plugin.redo();
        }
        // export csv
        else if (event.ctrlKey && event.key == 'e') {
            plugin.exportCSV();
        }
        event.preventDefault();
    });

    // set color of the color input to match that of the plugin
    let colorSelector = document.getElementById("measurement-color");
    if (plugin.color) {
        colorSelector.value = plugin.color;
    }
    else {
        plugin.color = "#000000";
    }

    // add new measurements to the window
    viewer.addHandler('canvas-double-click', () => {
        let measurementList = document.getElementById("measurement-list");
        let html = ""; // we will generate list items based on the measurements
        for (let i = 0; i < plugin.measurements.length; i++) {
            
        }
    })
}

function setColor() {
    colorSelector = document.getElementById("measurement-color");
    plugin.setMeasurementColor(colorSelector.value);
}


