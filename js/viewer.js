/*
 * viewer.js
 * Viewer page logic
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project
 */

window.onload = () => {
    // get the image url from the search parameters sent by index.html
    const urlParamsString = window.location.search;
    const urlParams = new URLSearchParams(urlParamsString);
    const tileSource = "./data/" + urlParams.get('tileSource') + ".dzi"

    // setup the viewer
    viewer = new OpenSeadragon({
        id: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        showNavigator: true,
        tileSources: tileSource,
        sequenceMode: false,
        zoomInButton: "zoom-in-button",
        zoomOutButton: "zoom-out-button",
        nextButton: "next-button",
        previousButton: "previous-button"
    })
}