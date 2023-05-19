/*
 * GridViewerPlugin.js
 *
 * Plugin for OpenSeadragon that adds Grid on OSD image
 *
 * By Vidhya Sree N
 * For CS410 - The Axolotl Project
 *
 * Requires OpenSeadragon Fabric.js,
 * and the OpenSeadragon Fabric.js Overlay plugin
 */

class GridViewerPlugin {
  constructor(viewer) {
    this.viewer = viewer;
    // pull in the two libraries
    this.overlay = viewer.fabricjsOverlay();
    this.fabricCanvas = this.overlay.fabricCanvas();
    this.gridGroup = new fabric.Group([], {
      selectable: false,
      evented: false
    });

    // Bind the toggleGrid and rotateGrid functions to the current instance
    this.toggleGrid = this.toggleGrid.bind(this);
    this.rotateGrid = this.rotateGrid.bind(this);

    // Add the plugin HTML to the viewer element
    this.addPluginHTML(viewer);
  }

  // Function to rotate the grid
  rotateGrid() {
    var angle = document.getElementById("grid-rotation-slider").value;
    this.gridGroup.setAngle(angle);
    var angleDisplay = document.getElementById("angle-display");
    angleDisplay.innerText = angle;
    this.fabricCanvas.renderAll();
  }

  // Function to toggle the grid
  toggleGrid() {
    var gridVisible = this.gridGroup.visible;
    this.gridGroup.visible = !gridVisible;
    this.fabricCanvas.renderAll();
    var gridRotationAngle = document.getElementById("grid-rotation-slider");
    var gridToggleSwitch = document.getElementById("grid");
    var angleDisplay = document.getElementById("angle-display")
    if (gridVisible) {
      gridRotationAngle.style.display = "none";
      angleDisplay.style.display = "none"
      gridToggleSwitch.checked = false;
    } else {
      gridRotationAngle.style.display = "block";
      angleDisplay.style.display = "block"
      gridToggleSwitch.checked = true;
    }
  }

  // Function to add the plugin HTML to the viewer element
  addPluginHTML(viewer) {
    // Create the plugin HTML
    const pluginHTML = `
    <div id="info">
        <span>Grid</span>
        <label class="switch" for="grid">
            <input type="checkbox" id="grid">
            <span class="slider round"></span>
        </label>
        <input type="range" min="-180" max="180" value="0" id="grid-rotation-slider" style="width:100px">
        <p id="angle-display"></p>
    </div>
  `;

    // Append the plugin HTML to the viewer element
    const viewerElement = document.getElementById(viewer.element.id);
    viewerElement.insertAdjacentHTML("beforeend", pluginHTML);

    // Attach event listeners using addEventListener
    document.getElementById("grid-rotation-slider").addEventListener("input", this.rotateGrid);
    document.getElementById("grid").addEventListener("change", this.toggleGrid);
  }



  addGrid() {
    // Function to initialize the Grid
    const init = () => {
      this.viewer.addHandler("open", () => {
        var gridSize = 500;
        var world = this.viewer.world;
        if (world) {
          var imageSize = world.getItemAt(0).getContentSize();
          var canvasWidth = imageSize.x;
          var canvasHeight = imageSize.y;

          // Draw horizontal lines
          for (var i = -(2 * canvasHeight); i < 2 * canvasHeight; i += gridSize) {
            var line = new fabric.Line([-(2 * canvasWidth), i, 2 * canvasWidth, i], {
              stroke: "black",
              strokeWidth: 5
            });
            this.gridGroup.add(line);
          }

          // Draw vertical lines
          for (var i = -(2 * canvasHeight); i < 2 * canvasWidth; i += gridSize) {
            var line = new fabric.Line([i, -(2 * canvasHeight), i, 2 * canvasHeight], {
              stroke: "black",
              strokeWidth: 5
            });
            this.gridGroup.add(line);
          }

          // Add the grid group to the overlay canvas
          this.fabricCanvas.add(this.gridGroup);
          this.gridGroup.visible = false;
        }
      });

      // Attach event listeners using addEventListener
      document.getElementById("grid-rotation-slider").addEventListener("input", this.rotateGrid);
      document.getElementById("grid").addEventListener("change", this.toggleGrid);
    };

    // Call the initialize function when the plugin is created
    init();
  }
}

