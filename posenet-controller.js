const config = require('./config.json');
import * as posenet from '@tensorflow-models/posenet';

export default class PosenetController {
  constructor(callback) {
    this.callback = callback;
    this.initialized = false;
    this.video = null;
  }

  async initialize() {
    this.video = await this.loadVideo();
    this.video.play();
    this.net = await posenet.load(config.mobileNetArchitecture);
    this.initialized = true;
    this.loop();
  } 

  async loadVideo() {
    const video = document.createElement('video');
    video.width = config.width;
    video.height = config.height;
    video.style.display = 'none';

    const stream = await this.getStream();
    video.srcObject = stream;
    document.querySelector('body').appendChild(video);

    return new Promise((resolve) => {
      video.onloadedmetadata = () => { resolve (video) };
    });
  }

  async loop() {
    let pose = await this.getPose();
    if (this.callback && pose) this.callback(pose);
    requestAnimationFrame(this.loop.bind(this));
  }

  async getPose() {
    const posenetArgs = [
      this.video,
      config.imageScaleFactor,
      config.flipHorizontal,
      config.outputStride
    ];

    const poses = await this.net.estimateMultiplePoses(...posenetArgs);

    if (poses.length > 0 && poses[0].score >= config.minPoseConfidence) {
      return poses[0];
    } else {
      return false;
    }
  }

  async getStream() {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: config.width,
        height: config.height
      }
    });
  }
}