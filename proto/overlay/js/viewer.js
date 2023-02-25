/*
    viewer.js
    Logic for the overlay viewer - loads both libraries in one view
    By Nicholas Verrochi
    For CS410 - The Axolotl Project
*/

window.onload = function() {
    // create the openseadragon viewer
    let viewer = OpenSeadragon({
        id: "openseadragon-viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../../data/W255B_0.dzi",
        sequenceMode: false,
        useCanvas: true
    });

    // setup cornerstone image loaders
    cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    cornerstone.registerImageLoader("http", cornerstoneWebImageLoader.loadImage);
    cornerstone.registerImageLoader("https", cornerstoneWebImageLoader.loadImage);
    cornerstone.registerImageLoader("data", cornerstoneWebImageLoader.loadImage);

    // initialize cornerstone tools
    let csTools = cornerstoneTools.init();
    cornerstoneTools.toolStyle.setToolWidth(1);
    cornerstoneTools.toolColors.setToolColor("rgb(255, 255, 0)");
    cornerstoneTools.toolColors.setActiveColor("rgb(255, 255, 0)");

    // enable cornerstone in its element
    let cornerstoneElement = document.getElementById("cornerstone-viewer");
    cornerstone.enable(cornerstoneElement);

    // add tools
    let LengthTool = cornerstoneTools.LengthTool;
    csTools.addTool(LengthTool);
    csTools.setToolActive("Length", { mouseButtonMask: 1 });

    // capture the background while tool is active
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL("image/png");
    cornerstone.loadImage(dataURL).then(function (image) {
        cornerstone.displayImage(cornerstoneElement, image);
    });
}