/*
 * osd-measure-and-annotate.js
 * 
 * Plugin for OpenSeadragon that allows for measuring
 * as well as annotation on the same image.
 * 
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project
 * 
 * Requires OpenSeadragon, Annotorious, Fabric.js, 
 * and the OpenSeadragon Fabric.js Overlay plugin
 */

class OSDMeasureAndAnnotate {
    constructor(viewer) {
        this.viewer = viewer;

        // pull in the two libraries
        this.overlay = viewer.fabricjsOverlay();
        this.fabricCanvas = this.overlay.fabricCanvas();
        this.annotations = OpenSeadragon.Annotorious(viewer);
        //this.annotations.loadAnnotations('annotations.w3c.json');

        // enum to represent modes of operation - symbol enforces use of the enum
        this.Modes = {
            ZOOM: Symbol("zoom"),
            MEASURE: Symbol("measure")
        };

        // setting up variables used in tracking what user is doing
        this.mode = this.Modes.ZOOM; // start in ZOOM mode (no measurements taken on click)
        this.isMeasuring = false; // toggles when user places first point of a measurement
        // the two points used to measure - these are image coordinates
        this.p1 = null;
        this.p2 = null;
        // store all the measurements (and extraneous points)
        this.measurements = [];

        // add our custom handler for measurements
        this.viewer.addHandler('canvas-double-click', (event) => {
            if (this.mode == this.Modes.MEASURE) {
                this.handleClickMeasure(event);
            }
        });

        /*
        // re-render on page event (change in zoom)
        this.viewer.addHandler('zoom', (event) => {
            let objects = this.fabricCanvas.getObjects();
            this.fabricCanvas.clear();
            for (let i = 0; i < objects.length; i++) {
                objects[i].render(this.fabricCanvas, this.viewer.viewport.getZoom(true));
            }
        });
        */
    }

    /*
     * handleClickMeasure:
     *     Only called in measuring mode - places a new point onto the canvas,
     *     and performs measuring once two points have been placed.
     */
    handleClickMeasure(event) {
        let webPoint = event.position;
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
        let zoom = this.viewer.viewport.getZoom(true);
        if (this.isMeasuring) { // already have a point, so complete the measurement
            this.p2 = new Point(imagePoint.x, imagePoint.y);
            let measurement = new Measurement(this.p1, this.p2);
            // have to remove the original first dot - looking for a workaround
            this.fabricCanvas.remove(this.p1.fabricObject);
            measurement.render(this.fabricCanvas, zoom);
            this.measurements.push(measurement);
        } else {
            this.p1 = new Point(imagePoint.x, imagePoint.y);
            this.p1.render(this.fabricCanvas, zoom);
        }
        this.isMeasuring = !this.isMeasuring;
    }

    /*
     * toggleMeasuring:
     *     Switches between the two modes of operation - note this does not
     *     disable the custom buttons - this needs to be done in the buttons'
     *     onclick handlers
     */
    toggleMeasuring() {
        if (this.mode == this.Modes.ZOOM) {
            this.mode = this.Modes.MEASURE;
            // disable zoom on click
            this.viewer.zoomPerClick = 1;
            // disable annotation selection so user can measure where there are annotations
            this.annotations.disableSelect = true;
        } else {
            this.mode = this.Modes.ZOOM;
            // re-enable zoom on click
            this.viewer.zoomPerClick = 2;
            // re-enable annotation selection
            this.annotations.disableSelect = false;
        }
    }
}
