

(function ($) {
  
  if (!$.version || $.version.major < 2) {
    throw new Error(
      'This version of OpenSeadragonLengthTool requires ' +
        'OpenSeadragon version 2.0.0+',
    )
  }

  $.Viewer.prototype.lengthtool = function (options) {
    if (!this.lengthtoolInstance) {
      options = options || {}
      options.viewer = this
      this.lengthtoolInstance = new $.LengthTool(options)
    } else {
      this.lengthtoolInstance.refresh(options)
    }
  }

  $.LengthToolType = {
    NONE: 0,
    MICROSCOPY: 1,
    MAP: 2,
  }

  $.LengthToolLocation = {
    NONE: 0,
    TOP_LEFT: 1,
    TOP_RIGHT: 2,
    BOTTOM_RIGHT: 3,
    BOTTOM_LEFT: 4,
  }

  $.LengthTool = function (options) {
    options = options || {}
    if (!options.viewer) {
      throw new Error('A viewer must be specified.')
    }
    this.viewer = options.viewer

    this.divElt = document.createElement('div')
    // this.canvas = document.createElement('canvas')
    this.viewer.container.appendChild(this.divElt)
    this.viewer.container.prepend(this.canvas)

    // this.viewer.container.appendChild(this.canvas)
    // this.canvas.id = 'canvas'
    // this.canvas.style.position = 'absolute'
    // this.canvas.style.top = '0'
    // this.canvas.style.background = 'green'
    // this.canvas.style.width = '1706px'
    // this.canvas.style.height = '1358px'
    // this.canvas.style.opacity = "25%";

    this.divElt.style.position = 'relative'
    this.divElt.style.margin = '0'
    this.divElt.style.pointerEvents = 'none'
    // const ccanvas = document.getElementById('canvas');
    // const dataURL = ccanvas.toDataURL();
    // console.log(dataURL);


    var self = this
    this.viewer.addHandler('open', function () {
      self.refresh()
    })
    this.viewer.addHandler('animation', function () {
      self.refresh()
    })
    this.viewer.addHandler('resize', function () {
      self.refresh()
    })
  }

  $.LengthTool.prototype = {
    refresh: function (options) {
      this.divElt.style.display = ''

      var viewport = this.viewer.viewport
      //   var tiledImage = this.viewer.world.getItemAt(this.referenceItemIdx)
      //   var zoom = tiledImageViewportToImageZoom(
      //     tiledImage,
      //     viewport.getZoom(true),
      //   )
      //   var currentPPM = zoom * this.pixelsPerMeter
      //   var props = this.sizeAndTextRenderer(currentPPM, this.minWidth)
      // console.log(this.viewer);
      // var ctx = this.viewer.canvas.getContext('2d');
      // ctx.fillStyle = "#FF0000";
      // ctx.fillRect(0, 0, 150, 75);

      this.drawLengthTool()
      //   var location = this.getLengthToolLocation()
      //   this.divElt.style.left = location.x + 'px'
      //   this.divElt.style.top = location.y + 'px'
    },

    drawLengthTool: function () {
    //   this.divElt.classList.add('cornerstone-element')
      this.divElt.style.fontSize = 97
      this.divElt.style.textAlign = 'center'
      this.divElt.style.color = 'yellow'
      this.divElt.style.border = 'none'
      this.divElt.style.borderBottom = 2 + 'px solid ' + 'yellow'
    //   this.divElt.style.backgroundColor = 'green'
      this.divElt.style.width = 16 + 'px'
    },

    /**
     * Get the rendered scalebar in a canvas.
     * @returns {Element} A canvas containing the scalebar representation
     */
    getAsCanvas: function () {
      console.log('hello')

      var canvas = document.createElement('canvas')
      canvas.width = this.divElt.offsetWidth
      canvas.height = this.divElt.offsetHeight
      var context = canvas.getContext('2d')
      context.fillStyle = 'red'
      context.fillRect(0, 0, 1000, 1000)
      // context.fillStyle = this.color;
      context.fillStyle = 'blue'

      //   context.fillRect(
      //     0,
      //     canvas.height - this.barThickness,
      //     canvas.width,
      //     canvas.height,
      //   )
      //   if (this.drawLengthTool === this.drawMapLengthTool) {
      //     context.fillRect(0, 0, this.barThickness, canvas.height)
      //     context.fillRect(
      //       canvas.width - this.barThickness,
      //       0,
      //       this.barThickness,
      //       canvas.height,
      //     )
      //   }
      //   context.font = window.getComputedStyle(this.divElt).font
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      //   context.fillStyle = this.fontColor
      var hCenter = canvas.width / 2
      var vCenter = canvas.height / 2
      context.fillText(this.divElt.textContent, hCenter, vCenter)

      return canvas
    },
  }

  function isDefined(variable) {
    return typeof variable !== 'undefined'
  }
})(OpenSeadragon)
