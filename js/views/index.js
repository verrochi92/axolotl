/*
 * index.js
 *
 * Javascript logic for the index page
 * 
 * By Nicholas Verrochi
 * For CS410 - The Axolotl Project
 */

function startButton() {
    imageSelect = document.getElementById("image-select");
    image = imageSelect.value;
    window.open("./viewer.html?tileSource=" + image, "_self");
}