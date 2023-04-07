/**
 * Point.js
 * Object model to represent a point (part of a measurement)
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project
 */

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /* renders the object onto the fabricCanvas based on zoom */
    render(fabricCanvas, zoom) {
        this.fabricObject = new fabric.Circle({
            originX: 'center',
            originY: 'center',
            left: this.x,
            top: this.y,
            fill: 'red',
            radius: 50
            //radius: 100 / zoom
        });
        fabricCanvas.add(this.fabricObject);
    }
}