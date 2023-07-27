/**
 * preview-viewer.js
 * 
 * Javascript controller for preview-viewer.html, the
 * smaller viewer used to preview images in the index
 * 
 * By Nicholas Verrochi and Vidhya Sree N
 * 
 * For CS410 - The Axolotl Project
 */

// load the image into the viewer
window.onload = () => {
    // get the image url from the search parameters sent by index.html
    const urlParamsString = window.location.search;
    const urlParams = new URLSearchParams(urlParamsString);
    const imageName = urlParams.get("tileSource");
    const tileSource = "./data/" + imageName + ".dzi";

    let viewer = new OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        showNavigator: false,
        tileSources: tileSource,
        sequenceMode: false,
        showFullPageControl: false,
        showHomeControl: false,
        showZoomControl: false,
        zoomPerClick: 1
    });

    // open full-size viewer on click
    viewer.addHandler('canvas-click', () => {
        window.open("./viewer.html?tileSource=" + imageName, "_blank");
    });
}