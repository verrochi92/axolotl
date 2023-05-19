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
    this.overlay = viewer.fabricjsOverlay();
    this.fabricCanvas = this.overlay.fabricCanvas();
    this.gridGroup = new fabric.Group([], {
      selectable: false,
      evented: false
    });

    // Bind the toggleGrid, rotateGrid, and changeGridSize functions to the current instance
     this.toggleGrid = this.toggleGrid.bind(this);
     this.rotateGrid = this.rotateGrid.bind(this);
     this.changeGridSize = this.changeGridSize.bind(this);

    // Add the plugin HTML to the viewer element
    this.addPluginHTML(viewer);
  }

   // Function to toggle the grid
   toggleGrid() {
     var gridVisible = this.gridGroup.visible;
     this.gridGroup.visible = !gridVisible;
     this.fabricCanvas.renderAll();
     var gridRotationAngle = document.getElementById("grid-rotation-slider");
     var gridToggleSwitch = document.getElementById("grid");
     var angleDisplay = document.getElementById("angle-display");
     var gridRotationLabel = document.getElementById("grid-rotation-label");
     var gridSizeLabel = document.getElementById("grid-size-label");
     var gridSizeChange = document.getElementById("grid-size-slider");
     var gridSizeDisplay = document.getElementById("grid-size-value")
     if (gridVisible) {
       gridRotationAngle.style.display = "none";
       angleDisplay.style.display = "none"
       gridRotationLabel.style.display= "none";
       gridSizeLabel.style.display= "none";
       gridSizeChange.style.display= "none";
       gridSizeDisplay.style.display= "none";
       gridToggleSwitch.checked = false;
     } else {
       gridSizeLabel.style.display= "block";
       gridSizeChange.style.display= "block";
       gridRotationAngle.style.display = "block";
       angleDisplay.style.display = "block"
       gridRotationLabel.style.display= "block";
       gridSizeDisplay.style.display= "block";
       gridToggleSwitch.checked = true;
       gridRotationLabel.innerText = "Grid Rotation:"
       gridSizeLabel.innerText = "Grid Size:"
     }
   }

  changeGridSize() {
    const gridSizeSlider = document.getElementById("grid-size-slider");
    const gridSizeValue = document.getElementById("grid-size-value");
    const gridSize = parseInt(gridSizeSlider.value);
    gridSizeValue.innerText = gridSize/100 + "mm";

    // Convert the grid size to the desired unit (e.g., pixels)
    const scaledGridSize = gridSize;

    // Clear the existing grid lines
    this.gridGroup.remove(...this.gridGroup.getObjects("line"));

    var world = this.viewer.world;
    if (world) {
      var imageSize = world.getItemAt(0).getContentSize();
      var canvasWidth = imageSize.x;
      var canvasHeight = imageSize.y;

      // Draw horizontal lines
      for (var i = -(2 * canvasHeight); i < 2 * canvasHeight; i += scaledGridSize) {
        var line = new fabric.Line([-(2 * canvasWidth), i, 2 * canvasWidth, i], {
          stroke: "black",
          strokeWidth: 5
        });
        this.gridGroup.add(line);
      }

      // Draw vertical lines
      for (var i = -(2 * canvasHeight); i < 2 * canvasWidth; i += scaledGridSize) {
        var line = new fabric.Line([i, -(2 * canvasHeight), i, 2 * canvasHeight], {
          stroke: "black",
          strokeWidth: 5
        });
        this.gridGroup.add(line);
      }

      this.fabricCanvas.renderAll();
    }
  }

  // Function to rotate the grid
  rotateGrid() {
    var angle = document.getElementById("grid-rotation-slider").value;
    this.gridGroup.setAngle(angle);
    var angleDisplay = document.getElementById("angle-display");
    angleDisplay.innerText = angle;
    this.fabricCanvas.renderAll();
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
        <p id="grid-rotation-label"></p>
        <div class="slider-container">
            <input type="range" min="-180" max="180" value="0" id="grid-rotation-slider" class="slider-input">
            <p id="angle-display" class="slider-value"></p>
        </div>
        <p id="grid-size-label"></p>
        <div class="slider-container">
            <input type="range" min="100" max="5000" value="500" id="grid-size-slider" class="slider-input">
            <p id="grid-size-value" class="slider-value" style="display:none"></p>
        </div>
    </div>
  `;

    // Append the plugin HTML to the viewer element
    const viewerElement = document.getElementById(viewer.element.id);
    viewerElement.insertAdjacentHTML("beforeend", pluginHTML);

  // Attach event listeners using addEventListener
  document.getElementById("grid-rotation-slider").addEventListener("input", this.rotateGrid);
  document.getElementById("grid").addEventListener("change", this.toggleGrid);
  document.getElementById("grid-size-slider").addEventListener("input", this.changeGridSize);
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

          this.changeGridSize(); // Call the changeGridSize() function
        }
      });

      // Attach event listeners using addEventListener
          document.getElementById("grid-rotation-slider").addEventListener("input", this.rotateGrid);
          document.getElementById("grid").addEventListener("change", this.toggleGrid);
          document.getElementById("grid-size-slider").addEventListener("input", this.changeGridSize);
    };

    // Call the initialize function when the plugin is created
    init();
  }
}