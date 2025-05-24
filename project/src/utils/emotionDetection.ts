import * as tf from '@tensorflow/tfjs';
import * as faceapi from '@vladmandic/face-api';

let isModelLoaded = false;

export async function loadModels() {
  if (isModelLoaded) return;

  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
  
  isModelLoaded = true;
}

export async function detectEmotion(video: HTMLVideoElement) {
  if (!isModelLoaded) {
    await loadModels();
  }

  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (!detection) return null;

  // Get the emotion with highest confidence
  const emotions = detection.expressions;
  const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
    a[1] > b[1] ? a : b
  );

  return {
    emotion: dominantEmotion[0],
    confidence: Math.round(dominantEmotion[1] * 100)
  };
}