/*
    viewer.js
    Logic for the OpenSeadragon viewer
    By Nicholas Verrochi
    For CS410 - The Axolotl Project
*/

window.onload = function () {
    viewer = OpenSeadragon({
        id: "openseadragon-viewer",
        visibilityRation: 1.0,
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../../data/W255B_0.dzi"
    });


    var tracker = new OpenSeadragon.MouseTracker({
        element: viewer.container,
        moveHandler: function (event) {
            var webPoint = event.position;
            var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
            var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

            var display = document.getElementById("coordinates");
            display.innerText = "Coordinates: " + imagePoint.toString();
        }
    });

    tracker.setTracking(true);
}