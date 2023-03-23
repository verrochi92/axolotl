// OpenSeadragon Text Overlay plugin

(function() {

   var $ = window.OpenSeadragon;

   if (!$) {
       $ = require('openseadragon');
       if (!$) {
           throw new Error('OpenSeadragon is missing.');
       }
   }

   var svgNS = 'http://www.w3.org/2000/svg';

   // ----------
   $.Viewer.prototype.textOverlay = function() {
       if (this._textOverlayInfo) {
           return this._textOverlayInfo;
       }

       this._textOverlayInfo = new Overlay(this);
       return this._textOverlayInfo;
   };

   // ----------
   var Overlay = function(viewer) {
       var self = this;

       this._viewer = viewer;
       this._containerWidth = 0;
       this._containerHeight = 0;

       this._svg = document.createElementNS(svgNS, 'svg');
       this._svg.style.position = 'absolute';
       this._svg.style.left = 0;
       this._svg.style.top = 0;
       this._svg.style.width = '100%';
       this._svg.style.height = '100%';
       this._viewer.canvas.appendChild(this._svg);

       this._node = document.createElementNS(svgNS, 'g');
       this._svg.appendChild(this._node);

       this._viewer.addHandler('animation', function() {
           self.resize();
       });

       this._viewer.addHandler('open', function() {
           self.resize();
       });

       this._viewer.addHandler('rotate', function(evt) {
           self.resize();
       });

       this._viewer.addHandler('flip', function() {
         self.resize();
       });

       this._viewer.addHandler('resize', function() {
           self.resize();
       });

       this._viewer.addHandler('click', function(evt) {
           var viewportPoint = self._viewer.viewport.pointFromPixel(evt.position);
           var imagePoint = self._viewer.viewport.viewportToImageCoordinates(viewportPoint);
           var x = imagePoint.x;
           var y = imagePoint.y;
           var text = prompt('Enter annotation text:', '');
           if (text !== null && text !== '') {
               self.addText(text, x, y);
           }
       });

       this.resize();
   };

   // ----------
   Overlay.prototype = {
       // ----------
       node: function() {
           return this._node;
       },

       // ----------
       resize: function() {
           if (this._containerWidth !== this._viewer.container.clientWidth) {
               this._containerWidth = this._viewer.container.clientWidth;
               this._svg.setAttribute('width', this._containerWidth);
           }

           if (this._containerHeight !== this._viewer.container.clientHeight) {
               this._containerHeight = this._viewer.container.clientHeight;
               this._svg.setAttribute('height', this._containerHeight);
           }

           var p = this._viewer.viewport.pixelFromPoint(new $.Point(0, 0), true);
           var zoom = this._viewer.viewport.getZoom(true);
           var rotation = this._viewer.viewport.getRotation();
           var flipped = this._viewer.viewport.getFlip();
           // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
           var containerSizeX = this._viewer.viewport._containerInnerSize.x
           var scaleX = containerSizeX * zoom;
           var scaleY = scaleX;

           if(flipped){
               // Makes the x component of the scale negative to flip the svg
               scaleX = -scaleX;
               // Translates svg back into the correct coordinates when the x scale is made negative.
               p.x = -p.x + containerSizeX;
           }

           this._node.setAttribute('transform',
               'translate(' + p.x + ',' + p.y + ') scale(' + scaleX + ',' + scaleY + ') rotate(' + rotation + ')');
       },

       // ----------
       // ----------
       addText: function(text, x, y) {
           var textEl = document.createElementNS(svgNS, 'text');
           textEl.textContent = text;
           textEl.setAttribute('x', x);
           textEl.setAttribute('y', y);
           textEl.setAttribute('font-size', '16px');
           textEl.setAttribute('fill', 'white');
           this._node.appendChild(textEl);
       },
   };

})();