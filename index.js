import 'babel-polyfill';
const config = require('./config.json');
import PosenetController from './posenet-controller';
import {getMidpoint, getKeypoints, getDistance} from './helpers';
import { configure } from 'protobufjs';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

const baseEyespan = 7; // cm
const smoothing = 0.7;
const smoothingScale = 0.95;

const posenetController = new PosenetController(onPoseDetected);
posenetController.initialize();


let [x0, y0, eyespan0] = [0, 0, 0];
function smooth(x, y, eyespan) {
  const xSmooth = (x - x0) * (1 - smoothing) + x0;
  const ySmooth = (y - y0) * (1 - smoothing) + y0;
  const eyespanSmooth = (eyespan - eyespan0) * (1 - smoothingScale) + eyespan0;
  [x0, y0, eyespan0] = [xSmooth, ySmooth, eyespanSmooth];
  return [xSmooth, ySmooth, eyespanSmooth];
}

let lastOffsets = [0, 0];
let firstRun = true;
let pixelRatio;
function onPoseDetected(pose) {
  // Get keypoints & relevant positions/distances
  const keypoints = getKeypoints(pose, ['leftEye', 'rightEye']);

  let x1 = config.width/2 - getMidpoint(keypoints['leftEye'], keypoints['rightEye'], 'x');
  let y1 = config.height/2 - getMidpoint(keypoints['leftEye'], keypoints['rightEye'], 'y');
  let eyespan1 = getDistance(keypoints.leftEye, keypoints.rightEye);

  if (firstRun) {
    pixelRatio = baseEyespan / eyespan1;
    firstRun = false;
  }

  // Convert to cm instead of pixels
  [x1, y1, eyespan1] = ([x1, y1, eyespan1]).map(i => i*pixelRatio);

  let [x, y, eyespan] = smooth(x1, y1, eyespan1);

  const elems = document.querySelectorAll('.depth-layer');
  elems.forEach((elem) => {
    const depth = parseFloat(getComputedStyle(elem).zIndex);

    // Convert back to pixels from cm
    const xOffset = (1/pixelRatio) * depth * (x / 30);
    const yOffset = (1/pixelRatio) * depth * (y / 30);

    const scale = 1 + (-depth * 1/30) / (eyespan * pixelRatio);

    elem.style.transform = `
      translate(${xOffset}px, ${yOffset}px)
      scale(${scale})
    `;

    lastOffsets = [xOffset, yOffset];
  });
}