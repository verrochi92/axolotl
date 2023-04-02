/**
 * viewer.js
 * Logic for the plugin prototype - adjusts measurements with zoom
 * By Nicholas Verrochi and Vidhya Sree Narayanappa
 * For CS410 - The Axolotl Project
 */

// enum to represent modes of operation - symbol enforces use of the enum
const Mode = {
    ZOOM: Symbol("zoom"),
    MEASURE: Symbol("measure"),
    ANNOTATE: Symbol("annotate")
};

// viewer mode - start in zoom mode
var mode = Mode.ZOOM;
// flag used when measuring - when false, starts a measurement on click
// when true, finishes a measurement on click (user has 2 points)
var isMeasuring = false;
// points used for measuring
var p1 = null, p2 = null;
// the OSD viewer
var viewer;
// the fabric.js overlay
var overlay;

window.onload = function () {
    viewer = OpenSeadragon({
        id: "viewer",
        visibilityRatio: 1.0,
        showNavigator: true,
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: [
            "../../data/W255B_0.dzi",
            "../../data/W255B_1.dzi",
            "../../data/W255B_2.dzi"
        ],
        sequenceMode: true,

        zoomInButton: "zoom-in-button",
        zoomOutButton: "zoom-out-button",
        nextButton: "next-button",
        previousButton: "previous-button"
    });
    overlay = viewer.fabricjsOverlay();

    // register click handlers
    viewer.addHandler('canvas-double-click', (event) => {
        if (mode === Mode.MEASURE) {
            handleClickMeasure(event);
        }
    });
};

function handleClickMeasure(event) {
    let webPoint = event.position;
    let viewportPoint = viewer.viewport.pointFromPixel(webPoint);
    let imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
    // render square at imagePoint
    overlay.fabricCanvas().add(new fabric.Circle({
        originX: 'center',
        originY: 'center',
        left: imagePoint.x,
        top: imagePoint.y,
        fill: 'red',
        radius: 50
    }));
    if (isMeasuring) {
        p2 = imagePoint;
        // draw line between p1 and p2
        let line = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
            stroke: 'red',
            strokeWidth: 10
        });
        // calculate distance between p1 and p2
        let distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        // create text object to display measurement
        let text = new fabric.Text(distance.toFixed(2) + ' px', {
            left: (p1.x + p2.x) / 2,
            top: (p1.y + p2.y) / 2,
            fontSize: 100,
            fill: 'red'
        });
        // rotate text object to align with line
        let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        text.setAngle(angle);
        overlay.fabricCanvas().add(line, text);
    } else {
        p1 = imagePoint;
    }
    isMeasuring = !isMeasuring
}


function measureButton() {
    mode = Mode.MEASURE;
    // disable zoom on click 
    viewer.zoomPerClick = 1;
    // switch to "stop measuring"
    let measureButton = document.getElementById("measure-button");
    measureButton.value = "Stop Measuring";
    measureButton.setAttribute("onclick", "javascript: stopMeasuring();");
    // disable the other buttons
    document.getElementById("zoom-in-button").disabled = true;
    document.getElementById("zoom-out-button").disabled = true;
    document.getElementById("next-button").disabled = true;
    document.getElementById("previous-button").disabled = true;
}

function stopMeasuring() {
    // undo what measureButton() did
    mode = Mode.ZOOM;
    viewer.zoomPerClick = 2;
    let measureButton = document.getElementById("measure-button");
    measureButton.value = "Measure";
    measureButton.setAttribute("onclick", "javascript: measureButton();");
    document.getElementById("zoom-in-button").disabled = false;
    document.getElementById("zoom-out-button").disabled = false;
    document.getElementById("next-button").disabled = false;
    document.getElementById("previous-button").disabled = false;
}
