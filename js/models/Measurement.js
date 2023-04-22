/**
 * Measurement.js
 * Object model to represent a measurement between two points
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project
 */

class Measurement {
    /* p1 and p2 are the **image** coordinates */
    constructor(p1, p2, color) {
        this.p1 = p1;
        this.p2 = p2;
        this.color = color;
        this.distance = Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));
    }

    /* convert pixels to nanometers                         *
     * NOTE: not reusable - this is specific to the project */
    toUM() {
        return this.distance * 4.54e-7 * 10e6;
    }

    /* render the measurement as 3 fabricjs objects on the viewer passed in */
    render(fabricCanvas, zoom) {
        this.p1.render(fabricCanvas, zoom);
        this.p2.render(fabricCanvas, zoom);

        // draw line between p1 and p2
        let line = new fabric.Line([this.p1.x, this.p1.y, this.p2.x, this.p2.y], {
            stroke: this.color,
            strokeWidth: 50 / zoom
        });
        fabricCanvas.add(line);
        // create text object to display measurement
        let text = new fabric.Text(this.distance.toFixed(2) + ' px', {
            left: Math.max(this.p1.x, this.p2.x) + 100 / zoom,
            top: this.p1.x > this.p2.x ? this.p1.y : this.p2.y,
            fontSize: 300 / zoom,
            fill: this.color
        });
        fabricCanvas.add(text);
    }
}