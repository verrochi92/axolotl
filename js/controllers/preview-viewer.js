/**
 * preview-viewer.js
 * 
 * Javascript controller for preview-viewer.html, the
 * smaller viewer used to preview images in the index
 * 
 * By Nicholas Verrochi
 * 
 * For CS410 - The Axolotl Project
 */

// load the image into the viewer
window.onload = () => {
    // get the image url from the search parameters sent by index.html
    const urlParamsString = window.location.search;
    const urlParams = new URLSearchParams(urlParamsString);
    const tileSource = "./data/" + urlParams.get('tileSource') + ".dzi";

    let viewer = new OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        showNavigator: false,
        tileSources: tileSource,
        sequenceMode: false,
    });
}