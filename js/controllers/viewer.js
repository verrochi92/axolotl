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
        preventDefaultAction: true
    });

    // initialize the plugin
    plugin = new OSDMeasureAndAnnotate(viewer, 4.54e-1, "um");

    /// display measurements if loaded from localStorage
    for (let i = 0; i < plugin.measurements.length; i++) {
        addMeasurementToList(plugin.measurements[i]);
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
        // override ctrl presses
        if (event.ctrlKey) {
            event.preventDefault();
        }
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
    document.addEventListener("measurement-added", () => {
        // add the newest measurement
        addMeasurementToList(plugin.measurements[plugin.measurements.length - 1]);
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
        // clear the measurement detail box
        let measurementDetails = document.getElementById("measurement-details");
        measurementDetails.style.setProperty("display", "none");
    });
}

function setColor() {
    colorSelector = document.getElementById("measurement-color");
    plugin.setMeasurementColor(colorSelector.value);
}

function toggleShortcuts() {
    var shortDiv = document.getElementById("shortcuts");
    if (shortDiv.style.getPropertyValue("display") == "none") {
        shortDiv.style.setProperty("display", "block");
    } else {
        shortDiv.style.setProperty("display", "none");
    }
}

function showMeasurementDetails(measurement) {
    let measurementDetails = document.getElementById("measurement-details");
    if (measurement) {
        measurementDetails.innerHTML = measurement.toListElementInnerHTML();
        // change stored name after editing
        let nameDisplays = document.getElementsByClassName(measurement.id);
        for (let i = 0; i < nameDisplays.length; i++) {
            nameDisplays[i].addEventListener('change', () => {
                measurement.name = nameDisplays[i].innerText;
                updateMeasurementDisplays(measurement);
                // save the new name
                plugin.saveToLocalStorage();
            });
        }
    } else {
        measurementDetails.innerHTML = `Measurement not found`;
    }
    measurementDetails.style.setProperty("display", "block");
}

function addMeasurementToList(measurement) {
    let measurementList = document.getElementById("measurement-list");
    let element = document.createElement("li");
    element.innerHTML = measurement.toListElementInnerHTML();
    // show details on click
    element.addEventListener("click", () => {
        showMeasurementDetails(measurement);
    });
    // add element to list in memory and in the dom
    measurementListElements.push(element);
    measurementList.appendChild(element);
    // add event listener to change name
    let nameDisplays = document.getElementsByClassName(measurement.id);
    for (let i = 0; i < nameDisplays.length; i++) {
        nameDisplays[i].addEventListener('change', () => {
            measurement.name = nameDisplays[i].innerText;
            updateMeasurementDisplays(measurement);
            // save the new name
            plugin.saveToLocalStorage();
        });
    }
}

// update the displayed text when a measurement name is changed
function updateMeasurementDisplays(measurement) {
    let elements = document.getElementsByClassName(measurement.id);
    for (let i = 0; i < elements.length; i++) {
        elements[i].innerText = measurement.name;
    }
}


