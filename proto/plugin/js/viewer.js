/**
 * viewer.js
 * Logic for the plugin prototype - adjusts measurements with zoom
 * By Nicholas Verrochi
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
};

function measureButton() {
    mode = Mode.MEASURE;
    // disable zoom on click 
    viewer.zoomPerClick = 1;
    // switch to "stop measuring"
    let measureButton = document.getElementById("measure-button");
    measureButton.value = "Stop Measuring";
    measureButton.setAttribute("onclick", "javascript: stopMeasuring();");
}

function stopMeasuring() {
    // undo what measureButton() did
    mode = Mode.ZOOM;
    viewer.zoomPerClick = 2;
    let measureButton = document.getElementById("measure-button");
    measureButton.value = "Measure";
    measureButton.setAttribute("onclick", "javascript: measureButton();");
}
