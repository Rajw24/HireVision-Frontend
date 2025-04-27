declare module '@mediapipe/face_detection' {
  export interface FaceDetectionResults {
    detections: Array<{
      boundingBox: {
        xCenter: number;
        yCenter: number;
        width: number;
        height: number;
      };
      landmarks: Array<{ x: number; y: number; z: number }>;
      score: number[];
    }>;
  }

  export class FaceDetection {
    constructor(config?: { locateFile?: (file: string) => string });
    setOptions(options: { model: 'short' | 'full'; minDetectionConfidence: number }): void;
    onResults(callback: (results: FaceDetectionResults) => void): void;
    send(config: { image: HTMLVideoElement }): Promise<void>;
  }
}

declare module '@mediapipe/camera_utils' {
  export class Camera {
    constructor(
      videoElement: HTMLVideoElement,
      config: {
        onFrame: () => Promise<void>;
        width: number;
        height: number;
      }
    );
    start(): Promise<void>;
    stop(): void;
  }
}