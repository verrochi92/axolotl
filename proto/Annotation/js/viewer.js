/*
    viewer.js
    By Vidhya Sree N
    For CS410 - The Axolotl Project
*/
window.onload = function() {
    // create the openseadragon viewer
    let viewer = OpenSeadragon({
        id: "openseadragon1",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "../../data/W255B_0.dzi",
        sequenceMode: false,
        useCanvas: true,
        keyboardShortcut: null,
        keyboardShortcutModifier: null
    });

    var isAnnotating = false;
    var currentAnnotation = null;

    // Define a function for creating annotations
    function createAnnotation(x, y, text) {
      var overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.left = x + 'px';
      overlay.style.top = y + 'px';
      overlay.style.background = 'rgba(255, 255, 0, 0.5)';
      overlay.style.padding = '5px';
      overlay.style.borderRadius = '5px';
      overlay.contentEditable = true;
      overlay.addEventListener('blur', function() {
        if (overlay.textContent.trim() === '') {
          viewer.removeOverlay(currentAnnotation);
        } else {
          currentAnnotation.textContent = overlay.textContent;
        }
        isAnnotating = false;
        currentAnnotation = null;
        overlay.remove();
      });
      viewer.addOverlay({
        element: overlay,
        location: viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x, y))
      });
      currentAnnotation = overlay;
      overlay.focus();
      if (text) {
        overlay.textContent = text;
      }
    }


    // Call the createAnnotation function when the user clicks on the viewer
    viewer.addHandler('canvas-click', function(event) {
      if (isAnnotating) return;
      var viewportPoint = event.position;
      var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
      createAnnotation(viewportPoint.x, viewportPoint.y);
      isAnnotating = true;
      event.preventDefault();
    });

    // Add click event listener to the annotate button
    var annotateButton = document.getElementById('annotate-button');
    annotateButton.addEventListener('click', function() {
      if (isAnnotating) return;
      createAnnotation(viewer.viewport.viewerWidth/2, viewer.viewport.viewerHeight/2);
      isAnnotating = true;
    });
 }



