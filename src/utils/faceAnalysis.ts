import * as faceapi from '@vladmandic/face-api';

let modelsLoaded = false;

export async function loadFaceModels() {
  if (modelsLoaded) return;
  
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
  
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  
  modelsLoaded = true;
  console.log('✅ Face-api models loaded (incluindo reconhecimento)');
}

export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  attention: number;
  expressions: { [key: string]: number };
}

export async function analyzeFace(videoElement: HTMLVideoElement): Promise<EmotionAnalysis | null> {
  if (!modelsLoaded) {
    console.log('🔄 Carregando modelos antes da análise...');
    await loadFaceModels();
  }

  console.log('🔍 Iniciando detecção facial...');
  
  const detections = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.5
    }))
    .withFaceLandmarks()
    .withFaceExpressions();

  if (!detections) {
    console.log('⚠️ Nenhuma detecção retornada pelo face-api');
    return null;
  }

  console.log('✅ Rosto detectado, analisando expressões...');
  const expressions = detections.expressions;
  console.log('📊 Expressões detectadas:', expressions);
  
  // Map face-api emotions to our emotion names
  const emotionMap: { [key: string]: string } = {
    'neutral': 'NEUTRA',
    'happy': 'INTERESSE_POSITIVO',
    'sad': 'PENSATIVA',
    'angry': 'CONFUSA',
    'fearful': 'SURPRESA',
    'disgusted': 'CONFUSA',
    'surprised': 'SURPRESA'
  };

  // Get dominant emotion
  let maxEmotion = 'neutral';
  let maxValue = 0;
  
  Object.entries(expressions).forEach(([emotion, value]) => {
    if (value > maxValue) {
      maxValue = value;
      maxEmotion = emotion;
    }
  });

  // Calculate attention based on facial features
  // Higher happiness, surprise = more attention
  // Higher neutral, sad = less attention
  const attentionScore = 
    (expressions.happy * 100) +
    (expressions.surprised * 80) +
    (expressions.angry * 60) +
    (expressions.fearful * 40) -
    (expressions.sad * 30) -
    (expressions.neutral * 20);
  
  const attention = Math.max(0, Math.min(100, 50 + attentionScore));

  return {
    emotion: emotionMap[maxEmotion] || 'NEUTRA',
    confidence: Math.round(maxValue * 100),
    attention: Math.round(attention),
    expressions: Object.fromEntries(
      Object.entries(expressions).map(([key, value]) => [key, Math.round(value * 100)])
    )
  };
}
