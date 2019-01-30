import 'babel-polyfill';
const config = require('./config.json');
import PosenetController from './posenet-controller';
import {getMidpoint, getKeypoints, getDistance} from './helpers';
import { configure } from 'protobufjs';

const posenetController = new PosenetController(posenetCallback);
posenetController.initialize();

function posenetCallback(pose) {
  const elem = document.querySelector('.background');
  
  const keypoints = getKeypoints(pose, ['leftEye', 'rightEye']);

  const x = getMidpoint(keypoints['leftEye'], keypoints['rightEye'], 'x');
  const y = getMidpoint(keypoints['leftEye'], keypoints['rightEye'], 'y');
  const scale = 80 - getDistance(keypoints.leftEye, keypoints.rightEye);

  const xOffset = (config.width / 2 - x)/7;
  const yOffset = (config.height / 2 - y)/7;

  elem.style.transform = `
    translate(${xOffset}px, ${yOffset}px)
  `;
}