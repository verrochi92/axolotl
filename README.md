# The Axolotl Project
by Nicholas Verrochi, Vidhya Sree Narayanappa, Sairam Bandarupalli and Andy Duverneau

Try it out: https://verrochi92.github.io/axolotl/

Project documentation: https://verrochi92.github.io/axolotl/documentation.pdf

## Previous work
This project is an extension of work done by Allen Dai in 2022: 

https://github.com/allendai1/cs460student/tree/main/axo

## What we added
The Axolotl Project is a client-side web application designed to help the McCusker 
lab at the University of Massachusetts in Boston better analyze the regerative properties
of the Axolotl. The original software allows for viewing scans of the animals at a high 
resolution and measuring the length in nanometers between two points on the image. Our work
improved the interface and allowed for saving and exporting measurement data. To do this we 
created a plugin for OpenSeadragon, an open-source zooming viewer for high-resolution
images, OSDMeasure. 

## OSDMeasure
OSDMeasure is our open-source plugin for OpenSeadragon that allows measurements to be
taken from any OpenSeadragon-compatible image, including the high-resolution DeepZoom
format used for the Axolotl scans. This plugin is the backbone of our project and was
designed with the community in mind, it can be used in other applications with similar
needs. For more information, see our repo [here](https://github.com/verrochi92/OSDMeasure). 

## Usage
From the index, you can select from a set of Axolotl scans. Once the image is loaded,
you can start measuring right away by double-clicking. Each time you double-click marks
a point on the image. Once a second point is chosen, you will see the length in nanometers
on the screen. To open the menu, click the icon in the top-right. From there you can change
the color of the measurements, give custom names to measurements, undo a measurement, redo
a previously undone measurement, reset all measurements and annotations, and export measurements
to a .csv file. There are various keyboard shortcuts for these features as well:

1. ctrl + z: undo
2. ctrl + y: redo
3. ctrl + r: reset
4. ctrl + e: export csv (will download the file)

To open the menu, simply click the top-right icon. From there, you will see a color picker to change
measurement rendering colors, a list of the measurements you've taken with editable labels, and some 
buttons for each of the features listed above that have keyboard shortcuts.

This project also uses Annotorious for annotations. To make an annotation, hold shift and click to draw a box.
To edit or delete an annotation, simply click on it to open an editor.

On the bottom left, there is a toggle for a grid to help make evenly spaced measurements. After toggling, the two sliders can adjust the
angle and size of the grid.

## Developer setup
Our project is easy to setup, every library we use is included, so you don't actually
need to download any of the dependencies or the OSDMeasure plugin, simply clone the
repository. Most of the functionality we added is within the plugin itself, so it might 
interest you more to work with OSDMeasure directly. 
