// the OSD viewer
var viewer;
// the fabric.js overlay
var overlay;

// initialize the grid group
var gridGroup = new fabric.Group([], {
    selectable: false,
    evented: false
});

var plugin; // stores the OSDMeasureAndAnnotate plugin

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

    });
    overlay = viewer.fabricjsOverlay();
    viewer.addHandler('open', () => {
        let fabricCanvas = overlay.fabricCanvas();
        let gridSize = 500;
        let imageSize = viewer.world.getItemAt(0).getContentSize();
        let canvasWidth = imageSize.x;
        let canvasHeight = imageSize.y;
        console.log("canvas height: " + canvasHeight);
        console.log("canvas width: " + canvasWidth);
        // draw horizontal lines
        for (let i = -(2 * canvasHeight); i < 2 * canvasHeight; i += gridSize) {
            let line = new fabric.Line([-(2 * canvasWidth), i, 2 * canvasWidth, i], {
                stroke: 'black',
                strokeWidth: 5
            });
            console.log("added line: " + line);
            gridGroup.add(line);
        }
        // draw vertical lines
        for (let i = -(2 * canvasHeight); i < 2 * canvasWidth; i += gridSize) {
            let line = new fabric.Line([i, -(2 * canvasHeight), i, 2 * canvasHeight], {
                stroke: 'black',
                strokeWidth: 5
            })
            console.log("added line: " + line);
            gridGroup.add(line);
        }

        // add the grid group to the overlay canvas
        fabricCanvas.add(gridGroup);
    });

}
function rotateGrid() {
    gridGroup.setAngle(5);
    overlay.fabricCanvas().renderAll();
}
function toggleGrid() {
    var gridVisible = gridGroup.visible;
    gridGroup.visible = !gridVisible;
    overlay.fabricCanvas().renderAll();
    var gridRotationButton = document.getElementById("grid-rotation");
    if (gridVisible) {
        gridRotationButton.classList.remove("visible");
    } else {
        gridRotationButton.classList.add("visible");
    }
}