/**
 * viewer-cornerstone.js
 * 
 * Prototype of the Cornerstone viewer 
 * with annotation and measurement tools
 * 
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project 
 */

// setting up cornerstone on page load
window.onload = function () {
    // setup image loaders
    cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    cornerstone.registerImageLoader('http', cornerstoneWebImageLoader.loadImage)
    cornerstone.registerImageLoader('https', cornerstoneWebImageLoader.loadImage)
    cornerstone.registerImageLoader('data', cornerstoneWebImageLoader.loadImage)

    // initialize tools and enable cornerstone in the viewer
    const csTools = cornerstoneTools.init()
    const element = document.getElementById("viewer")
    cornerstone.enable(element)

    // length tool
    const LengthTool = cornerstoneTools['LengthTool']
    csTools.addTool(LengthTool)
    csTools.setToolActive('Length', { mouseButtonMask: 1 });

    var canvas = document.getElementById("viewer");
    var context = canvas.getContext("2d");
    image = new Image();
    image.src = "img/test.jpeg";
    image.onload = function() {
        context.drawImage(image, 0, 0);
    }
    const dataURL = canvas.toDataURL("image/jpeg");

    cornerstone.loadImage(dataURL).then(function (image) {
        var img = image;
        img.rgba = true;
        cornerstone.displayImage(element, img)
    })
}
