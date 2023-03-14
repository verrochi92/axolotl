/*
    viewer.js
    Logic for the OpenSeadragon viewer
    By Nicholas Verrochi
    By Sairam Bandarupalli
    For CS410 - The Axolotl Project
*/

const PIXEL_SIZE = 4.54e-7;

window.onload = function () {
    viewer = OpenSeadragon({
        id: "openseadragon-viewer",
        //visibilityRation: 1.0,
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: [
            "../../data/W255B_0.dzi",
            "../../data/W255B_1.dzi",
            "../../data/W255B_2.dzi"],
        zoomInButton: "btn_zoomin",
        zoomOutButton: "btn_zoomout",
        nextButton: "btn_next",
        previousButton: "btn_prev",
        sequenceMode: true,
    });

    viewer.addHandler("page", function (data) {
        document.getElementById("a_nav").innerHTML = ( data.page + 1 ) + " of " + viewer.tileSources.length;
    });

    // setting up a mouse tracker to get coordinates
    var tracker = new OpenSeadragon.MouseTracker({
        element: viewer.container,
        moveHandler: function (event) {
            var webPoint = event.position;
            var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
            var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

            var display = document.getElementById("coordinates");
            display.innerHTML = "Coordinates: " + imagePoint.toString() + "<br />";
        }
    });

    // turning off zoom on click only when measure is set on...
    let measure = document.getElementById("btn_measure");
    measure.isdown = false;
    measure.addEventListener("click", function()
    {
        measure.isdown =! measure.isdown;
        viewer.zoomPerClick = measure.isdown == true ? 1 : 2;
        measure.style.opacity = measure.isdown == true ? 0.2 : 1;
    })

    // points for measuring
    let p1 = null;
    let p2 = null;
    let n = 0; // number of measurements

    // event handler on click
    viewer.addHandler("canvas-click", function(event) {
        let webPoint = event.position;
        let viewportPoint = viewer.viewport.pointFromPixel(webPoint);
        let imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

        // the null point is the one we need to add
        if (p1 == null) { // no points selected
            p1 = imagePoint;
            p2 = null; // clears the previous p2 value
        }
        else if (p2 == null) { // we have one point, need the second
            p2 = imagePoint;
            let length = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            length *= PIXEL_SIZE * 1e6; // convert to real-life units (um)
            n++;
            if(measure.isdown)
                document.getElementById("measurements").innerHTML += n + ": " + length + " um<br />";
            p1 = null;
        }
    });

    tracker.setTracking(true);
}
