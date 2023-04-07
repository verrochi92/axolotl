/**
 * Measurement.js
 * Object model to represent a measurement between two points
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project
 */

class Measurement {
    /* p1 and p2 are the **image** coordinates */
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    /* render the measurement as 3 fabricjs objects on the viewer passed in */
    render(fabricCanvas, zoom) {
        this.p1.render(fabricCanvas, zoom);
        this.p2.render(fabricCanvas, zoom);

        // draw line between p1 and p2
        let line = new fabric.Line([this.p1.x, this.p1.y, this.p2.x, this.p2.y], {
            stroke: 'red',
            strokeWidth: 10
            //strokeWidth: 50 / zoom
        });
        // calculate distance between p1 and p2
        let distance = Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));
        // create text object to display measurement
        let text = new fabric.Text(distance.toFixed(2) + ' px', {
            left: (this.p1.x + this.p2.x) / 2,
            top: (this.p1.y + this.p2.y) / 2,
            fontSize: 100,
            //fontSize: 200 / zoom,
            fill: 'red'
        });
        // rotate text object to align with line
        let angle = Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x) * 180 / Math.PI;
        text.setAngle(angle);
        fabricCanvas.add(line, text);
    }
}