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
        this.annotations = OpenSeadragon.Annotorious(viewer);
        this.annotations.loadAnnotations('annotations.w3c.json');

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
        this.fabricObjects = []; // stores all of our fabric.js objects

        // add our custom handler for measurements
        viewer.addHandler('canvas-double-click', (event) => {
            if (this.mode == this.Modes.MEASURE) {
                this.handleClickMeasure(event);
            }
        });
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
        // render square at imagePoint
        this.overlay.fabricCanvas().add(new fabric.Circle({
            originX: 'center',
            originY: 'center',
            left: imagePoint.x,
            top: imagePoint.y,
            fill: 'red',
            radius: 50
        }));
        if (this.isMeasuring) {
            this.p2 = imagePoint;
            // draw line between p1 and p2
            let line = new fabric.Line([this.p1.x, this.p1.y, this.p2.x, this.p2.y], {
                stroke: 'red',
                strokeWidth: 10
            });
            // calculate distance between p1 and p2
            let distance = Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));
            // create text object to display measurement
            let text = new fabric.Text(distance.toFixed(2) + ' px', {
                left: (this.p1.x + this.p2.x) / 2,
                top: (this.p1.y + this.p2.y) / 2,
                fontSize: 100,
                fill: 'red'
            });
            // rotate text object to align with line
            let angle = Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x) * 180 / Math.PI;
            text.setAngle(angle);
            this.overlay.fabricCanvas().add(line, text);
        } else {
            this.p1 = imagePoint;
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
