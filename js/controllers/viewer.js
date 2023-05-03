/**
 * viewer.js
 * Viewer page logic
 * By Nicholas Verrochi and Vidhya Sree N
 * For CS410 - The Axolotl Project
 */

var plugin; // stores the OSDMeasureAndAnnotate plugin
var measurementListElements = []; // measurements to display


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
        preventDefaultAction : true
    });

    // initialize the plugin
    plugin = new OSDMeasureAndAnnotate(viewer, 4.54e-1, "um");
    // display measurements if loaded from localStorage
    let measurementList = document.getElementById("measurement-list");
    for (let i = 0; i < plugin.measurements.length; i++) {
        let element = document.createElement("li");
        element.innerHTML = plugin.measurements[i].toListElement();
        element.addEventListener("click", () => {
            showMeasurementDetails(plugin.measurements[i].toListElement());
        });
        measurementListElements.push(element);
        measurementList.appendChild(element);
    }

    // add menus as children to the viewer so they display in fullscreen
    let viewerElement = document.getElementById("viewer");
    let menuIcon = document.getElementById("menu-icon");
    let measurementMenu = document.getElementById("measurement-menu");

//    viewerElement.appendChild(document.getElementById("shortcuts"));
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
        // reset
        if (event.ctrlKey && event.key == 'r') {
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
        if (event.ctrlKey) {
            event.preventDefault();
        }
    });

    plugin.measure();

    // set color of the color input to match that of the plugin
    let colorSelector = document.getElementById("measurement-color");
    if (plugin.color) {
        colorSelector.value = plugin.color;
    }
    else {
        plugin.color = "#000000";
    }

    // add new measurements to the window
    document.addEventListener("measurement-added", () => {
        let element = document.createElement("li");
        let measurement = plugin.measurements[plugin.measurements.length - 1]
        element.innerText = measurement.toListElement();
        measurementListElements.push(element);
        measurementList.appendChild(element);
    });
    // remove measurements on undo
    document.addEventListener("measurement-removed", () => {
        let element = measurementListElements.pop();
        measurementList.removeChild(element);
    });
    // remove all on reset
    document.addEventListener("measurements-reset", () => {
        while (measurementListElements.length > 0) {
            let element = measurementListElements.pop();
            measurementList.removeChild(element);
        }
    })
}

function setColor() {
    colorSelector = document.getElementById("measurement-color");
    plugin.setMeasurementColor(colorSelector.value);
}

function toggleShort() {
    var shortDiv = document.getElementById("short");
    if (shortDiv.style.display === "none") {
        shortDiv.style.display = "block";
    } else {
        shortDiv.style.display = "none";
    }
}
function showMeasurementDetails(measurementId) {
    var sideBox = document.getElementById("measurement-details");
    var measurement = measurementId;
    if (measurement) {
        sideBox.innerHTML = `<p>${measurementId}</p>`;
    } else {
        sideBox.innerHTML = `Measurement not found`;
    }
    sideBox.style.display = "block";
}


