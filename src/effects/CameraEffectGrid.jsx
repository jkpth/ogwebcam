// src/components/effects/CameraEffectGrid.jsx
import React from 'react';
import { SepiaEffect } from './SepiaEffect';
import { BWEffect } from './BWEffect';
import { GlowEffect } from './GlowEffect';
import { ComicEffect } from './ComicEffect';
import { NormalEffect } from './NormalEffect';
import { PencilEffect } from './PencilEffect';
import { ThermalEffect } from './ThermalEffect';
import { XRayEffect } from './XRayEffect';
import { PopArtEffect } from './PopArtEffect';

export function CameraEffectGrid({ videoRef, onSelectEffect, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 z-10">
      <div className="h-full flex flex-col">
        <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-2 p-4">
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <SepiaEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Sepia</span>
          </div>
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <BWEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">B&W</span>
          </div>
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <GlowEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Glow</span>
          </div>
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <ComicEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Comic</span>
          </div>
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <NormalEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Normal</span>
          </div>
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <PencilEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Pencil</span>
          </div>
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <ThermalEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Thermal</span>
          </div>
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <XRayEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">X-Ray</span>
          </div>
          <div className="relative aspect-video cursor-pointer hover:ring-2 hover:ring-white/50 rounded-lg overflow-hidden">
            <PopArtEffect videoRef={videoRef} />
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">Pop Art</span>
          </div>
        </div>
      </div>
    </div>
  );
}