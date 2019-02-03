# Depth Index 🐋

<a href="https://raw.githubusercontent.com/rupertparry/depth-index/master/assets/demo-video.mov"><img src="https://raw.githubusercontent.com/rupertparry/depth-index/master/assets/screenshot.png" alt="Depth-Index rendering a deep mountain range image"></a>

> A JavaScript package that turns z-index into physically realistic depth, using PoseNet face tracking. Deep, man.

Have you ever wanted your boring 2D web pages to have, like, one more dimension? Depth Index to the rescue. It's a rough experiment into adding more depth to your computer screen. This probably ain't production ready, folks.

## How it works

Depth Index uses Tensorflow & the PoseNet model from Google, to track the position of your eyes and the distance between them. From that, it renders physically accurate parallax & scaling, based on your face distance from the screen and position.

## Usage

Import the depth-index package:

`npm install depth-index`

or

`yarn add depth-index`

Then, import it at the top of your front-end JS file:

`import 'depth-index'`

Now, tell depth-index which layers you would like depth to apply to. Give them the class `depth-layer`, and add a negative z-index correlating to the distance from the screen in centimeters.

So, if you want an object to appear to be 10cm inside the screen, simply write:

`&lt;div class="depth-layer" style="z-index: -10"&gt;&lt;/div&gt;`

Enjoy getting deep.
