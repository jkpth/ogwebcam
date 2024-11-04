// src/components/effects/PopArtEffect.jsx
import React, { useState, useRef, useEffect } from 'react';
export function PopArtEffect({ videoRef }) {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrame;
  
      const drawFrame = () => {
        if (!videoRef.current) return;
        
        canvas.width = videoRef.current.videoWidth / 3; // Smaller for preview
        canvas.height = videoRef.current.videoHeight / 3;
        
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189); // red
          data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // green
          data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // blue
        }
  
        ctx.putImageData(imageData, 0, 0);
        animationFrame = requestAnimationFrame(drawFrame);
      };
  
      drawFrame();
  
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [videoRef]);
  
    return <canvas ref={canvasRef} className="w-full h-full object-cover" />;
  }