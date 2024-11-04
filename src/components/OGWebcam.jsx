// src/components/OGWebcam.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Circle } from 'lucide-react';
import { CameraEffectGrid } from '../effects/CameraEffectGrid';

export function OGWebcam() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [showEffects, setShowEffects] = useState(false);
  const [currentEffect, setCurrentEffect] = useState('normal');

  // Adjustable effect parameters
  const effects = {
    grainAmountR: 35,        // Red channel grain
    grainAmountG: 40,        // Green channel grain
    grainAmountB: 50,        // Blue channel grain
    contrast: 1.1,           // Slight contrast boost
    brightness: 1.05,        // Slight brightness boost
    saturation: 0.95,        // Slightly reduced saturation
    vignetteAmount: 0.15,    // Subtle vignette
    dynamicNoiseScale: 0.4   // How much the noise responds to brightness
  };

  const processFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    
    if (!video || !canvas || !displayCanvas || video.readyState !== 4) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const displayCtx = displayCanvas.getContext('2d', { willReadFrequently: true });
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    displayCanvas.width = video.videoWidth;
    displayCanvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);

      // Calculate pixel brightness to affect noise intensity
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 765; // 765 = 255 * 3
      const dynamicNoiseIntensity = brightness * effects.dynamicNoiseScale;

      // Generate colored noise that scales with brightness
      const noiseR = ((Math.random() - 0.5) * effects.grainAmountR) * (1 + dynamicNoiseIntensity);
      const noiseG = ((Math.random() - 0.5) * effects.grainAmountG) * (1 + dynamicNoiseIntensity);
      const noiseB = ((Math.random() - 0.5) * effects.grainAmountB) * (1 + dynamicNoiseIntensity);

      // Add noise to each channel
      data[i] += noiseR;     // Red
      data[i + 1] += noiseG; // Green
      data[i + 2] += noiseB; // Blue

      // Apply contrast and brightness
      for (let j = 0; j < 3; j++) {
        // Apply contrast
        data[i + j] = ((data[i + j] - 128) * effects.contrast) + 128;
        // Apply brightness
        data[i + j] *= effects.brightness;
      }

      // Apply saturation
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg + (data[i] - avg) * effects.saturation;
      data[i + 1] = avg + (data[i + 1] - avg) * effects.saturation;
      data[i + 2] = avg + (data[i + 2] - avg) * effects.saturation;

      // Apply vignette
      const distX = x / canvas.width - 0.5;
      const distY = y / canvas.height - 0.5;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const vignette = 1 - dist * effects.vignetteAmount * 2;
      
      data[i] *= vignette;
      data[i + 1] *= vignette;
      data[i + 2] *= vignette;
    }

    displayCtx.putImageData(imageData, 0, 0);
    animationRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            aspectRatio: { ideal: 4/3 }
          },
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setHasWebcamAccess(true);
            processFrame();
          };
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setHasWebcamAccess(false);
      }
    }

    setupWebcam();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="w-full bg-neutral-900 rounded-lg overflow-hidden">
        <div ref={containerRef} className="relative w-full aspect-video bg-black">
          <video ref={videoRef} autoPlay playsInline className="hidden" />
          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={displayCanvasRef} className="absolute inset-0 w-full h-full" />
          
          {!hasWebcamAccess && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Requesting camera access...
            </div>
          )}

          <CameraEffectGrid 
            videoRef={videoRef}
            isVisible={showEffects}
            onSelectEffect={(effect) => {
              setCurrentEffect(effect);
              setShowEffects(false);
            }}
          />
        </div>

        <div className="h-16 bg-gradient-to-b from-gray-300 to-gray-200 flex items-center justify-between px-4">
          <div className="flex space-x-2">
            <button className="w-8 h-8 rounded border border-gray-400 bg-white/80 flex items-center justify-center">
              <div className="w-4 h-4 border border-gray-500"></div>
            </button>
            <button className="w-8 h-8 rounded border border-gray-400 bg-white/80 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-500 rounded-sm"></div>
            </button>
            <button className="w-8 h-8 rounded border border-gray-400 bg-white/80 flex items-center justify-center">
              <div className="w-4 h-3 bg-gray-500"></div>
            </button>
          </div>

          <button 
            className="w-12 h-12 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors shadow-md"
            onClick={() => {
              const canvas = displayCanvasRef.current;
              if (canvas) {
                const photoUrl = canvas.toDataURL('image/jpeg', 0.85);
                console.log("Photo captured:", photoUrl);
              }
            }}
          >
            <Camera className="text-gray-700" size={24} />
          </button>

          <button 
            className="px-4 py-1 text-sm text-gray-600 hover:text-gray-800"
            onClick={() => setShowEffects(!showEffects)}
          >
            Effects
          </button>
        </div>
      </div>
    </div>
  );
}