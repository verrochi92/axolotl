/*
 * OSDMeasureAndAnnotate.js
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
        // temporarily stores undone measurements
        this.redoStack = [];

        // measurement marking color
        this.measurementColor = "#000000"

        // these are used to convert from pixels to real-world units
        this.conversionFactor = 1;
        this.units = "px";

        // save annotations after creations
        this.annotations.on('createAnnotation', () => {
            this.saveInLocalStorage();
        })

        // add our custom handler for measurements
        this.viewer.addHandler('canvas-double-click', (event) => {
            if (this.mode == this.Modes.MEASURE) {
                this.addMeasurement(event);
            }
        });

        // re-render on page event (change in zoom)
        this.viewer.addHandler('zoom', () => {
            this.renderAllMeasurements();
        });

        // re-render on rotation
        this.viewer.addHandler('rotate', () => {
            this.viewer.viewport.rotateTo(0);
        })

        this.loadFromLocalStorage();
    }

    /*
     * handleClickMeasure:
     *     Only called in measuring mode - places a new point onto the canvas,
     *     and performs measuring once two points have been placed.
     */
    addMeasurement(event) {
        let webPoint = event.position;
        let viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        let imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
        let zoom = this.viewer.viewport.getZoom();
        if (this.isMeasuring) { // already have a point, so complete the measurement
            this.p2 = new Point(imagePoint.x, imagePoint.y, this.measurementColor);
            let measurement = new Measurement(
                this.p1, this.p2, this.measurementColor, this.conversionFactor, this.units
            );
            // setup units
            measurement.conversionFactor = this.conversionFactor;
            measurement.units = this.units;
            // have to remove the original first dot - looking for a workaround
            this.fabricCanvas.remove(this.p1.fabricObject);
            measurement.render(this.fabricCanvas, zoom);
            this.measurements.push(measurement);
            this.saveInLocalStorage();
            // have to blow out the redo stack since we made a new measurement
            this.redoStack = [];
        } else { // place the first point
            this.p1 = new Point(imagePoint.x, imagePoint.y, this.measurementColor);
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
        } else { // this.mode == this.Modes.MEASURE
            this.mode = this.Modes.ZOOM;
            // re-enable zoom on click
            this.viewer.zoomPerClick = 2;
            // re-enable annotation selection
            this.annotations.disableSelect = false;
            if (this.isMeasuring) { 
                // cancel current measurement
                this.p1 = null;
                this.isMeasuring = !this.isMeasuring;
                this.renderAllMeasurements();
            }
        }
    }

    /**
     * saveInLocalStorage:
     *     Saves the measurements and annotations in localStorage in JSON format
     */
    saveInLocalStorage() {
        // we can use the tileSource as a key to identify which image we are working with
        let currentTileSource = this.viewer.tileSources; // for now only works with one source
        let json = JSON.stringify({
            measurements: this.measurements,
            annotations: this.annotations.getAnnotations()
        });
        localStorage.setItem(currentTileSource, json);
    }

    /**
     * loadFromLocalStorage:
     *     Loads any existing measurements from localStorage
     */
    loadFromLocalStorage() {
        // we will use the image name as a key
        let currentTileSource = this.viewer.tileSources;
        let data = JSON.parse(localStorage.getItem(currentTileSource));
        // make sure we have data
        if (data != null) {
            // we have to add the measurements and annotations one-by-one 
            for (let i = 0; i < data.measurements.length; i++) {
                // JSON.stringify() strips our methods from Measurement objects,
                // so we have to re-construct all of them one-by-one
                this.measurements.push(new Measurement(
                    new Point(parseInt(data.measurements[i].p1.x), parseInt(data.measurements[i].p1.y), data.measurements[i].color),
                    new Point(parseInt(data.measurements[i].p2.x), parseInt(data.measurements[i].p2.y), data.measurements[i].color),
                    data.measurements[i].color, this.conversionFactor, this.units
                ));
            }
            for (let i = 0; i < data.annotations.length; i++) {
                // Annotorious is set up to take the stripped objects from the JSON
                this.annotations.addAnnotation(data.annotations[i]);
            }
            // render the measurements
            this.renderAllMeasurements();
        }
    }

    /**
     * renderAllMeasurements:
     *     Renders all measurements
     */
    renderAllMeasurements() {
        this.fabricCanvas.clear();
        let zoom = this.viewer.viewport.getZoom();
        for (let i = 0; i < this.measurements.length; i++) {
            this.measurements[i].render(this.fabricCanvas, zoom);
        }
        if (this.isMeasuring && this.p1 != null) {
            this.p1.render(this.fabricCanvas, zoom);
        }
    }

    /**
     * clear:
     *     Erases all saved data (measurements and annotations) for
     *     this specific image from localStorage and clears fabric
     *     objects, measurement data, and annotations.
     */
    clear() {
        localStorage.removeItem(this.viewer.tileSources);
        this.fabricCanvas.clear();
        this.measurements = [];
        this.redoStack = [];
        this.annotations.clearAnnotations();
        this.p1 = null;
        this.p2 = null;
    }

    /**
     * undo:
     *     Undose the last action - if mid-measurement, the first
     *     point is erased and the user will have to start over.
     *     Otherwise, the last created measurement is erased.
     */
    undo() {
        if (this.isMeasuring) { // we have a point
            // store the point for redo
            this.redoStack.push(this.p1);
            this.p1 = null;
            this.isMeasuring = !this.isMeasuring;
            this.renderAllMeasurements();
        }
        else if (this.measurements.length > 0) { // we have a whole measurement
            // pop out of measurements and into redoStack
            this.redoStack.push(this.measurements.pop());
            this.saveInLocalStorage();
            this.renderAllMeasurements();
        }
        
    }

    /**
     * redo:
     *     replaces the last undone measurement or point if there are any in the stack
     */
    redo() {
        if (this.redoStack.length > 0) {
            let lastObject = this.redoStack.pop();
            // get zoom level for rendering
            let zoom = this.viewer.viewport.getZoom();
            // if it's a point, handle it as such
            if (lastObject instanceof Point) {
                this.p1 = lastObject;
                this.p1.render(this.fabricCanvas, zoom);
                // set isMeasuring so the next double-click finishes the measurement
                this.isMeasuring = true;
            }
            else { // it's a measurement
                this.measurements.push(lastObject);
                lastObject.render(this.fabricCanvas, zoom);
                // can't forget to save!
                this.saveInLocalStorage();
            }
        }
    }

    /**
     * setMeasurementColor:
     *     changes color of measurement markings, also when
     *     mid-measurement, changes the color of the first marking
     */
    setMeasurementColor(color) {
        this.measurementColor = color;
        console.log("color set...");
        if (this.isMeasuring) {
            console.log("re-rendering p1");
            // have to re-color the marking already placed
            this.p1.color = this.measurementColor;
            this.p1.fabricObject.remove();
            this.p1.render(this.fabricCanvas, this.viewer.viewport.getZoom());
        }
    }
}
