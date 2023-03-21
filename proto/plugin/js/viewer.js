/**
 * viewer.js
 * Logic for the plugin prototype - adjusts measurements with zoom
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project
 */

window.onload = function () {
    let viewer = OpenSeadragon({
        id: "viewer",
        visibilityRatio: 1.0,
        constrainDuringPan: true,
        showNavigator: true,
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: [ 
            "../../data/W255B_0.dzi",
            "../../data/W255B_1.dzi",
            "../../data/W255B_2.dzi"
        ],
        sequenceMode: true,

        zoomInButton: "zoom-in-button",
        zoomOutButton: "zoom-out-button",
        nextButton: "next-button",
        previousButton: "previous-button"
    });
};