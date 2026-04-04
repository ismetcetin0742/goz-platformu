"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Script from 'next/script';

interface VirtualTryOn3DProps {
  product: any;
  onClose: () => void;
}

declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

export default function VirtualTryOn3D({ product, onClose }: VirtualTryOn3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptsLoaded, setScriptsLoaded] = useState({ faceMesh: false, camera: false });

  useEffect(() => {
    if (!scriptsLoaded.faceMesh || !scriptsLoaded.camera) return;
    if (!window.FaceMesh || !window.Camera) return;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let glasses: THREE.Group;
    let faceMesh: any;
    let mediaPipeCamera: any;

    const init = async () => {
      // --- THREE.JS SETUP ---
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.z = 5;
      
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);

      // Aydınlatma
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 1, 1);
      scene.add(directionalLight);

      // Gözlük Modeli
      glasses = createSimpleGlasses();
      scene.add(glasses);
      glasses.visible = false;

      // --- MEDIAPIPE SETUP ---
      faceMesh = new window.FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results: any) => {
        onResults(results);
      });

      if (videoRef.current) {
        mediaPipeCamera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMesh) {
              await faceMesh.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });
        mediaPipeCamera.start().then(() => setIsLoading(false));
      }
    };

    const createSimpleGlasses = () => {
      const group = new THREE.Group();
      const material = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 100 });
      const lensMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x000000, 
        transparent: true, 
        opacity: 0.6,
        shininess: 200 
      });

      // Sol Cam
      const leftLensGeom = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
      const leftLens = new THREE.Mesh(leftLensGeom, material);
      leftLens.position.x = -0.7;
      group.add(leftLens);

      const leftGlassGeom = new THREE.CircleGeometry(0.5, 32);
      const leftGlass = new THREE.Mesh(leftGlassGeom, lensMaterial);
      leftGlass.position.x = -0.7;
      group.add(leftGlass);

      // Sağ Cam
      const rightLensGeom = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
      const rightLens = new THREE.Mesh(rightLensGeom, material);
      rightLens.position.x = 0.7;
      group.add(rightLens);

      const rightGlassGeom = new THREE.CircleGeometry(0.5, 32);
      const rightGlass = new THREE.Mesh(rightGlassGeom, lensMaterial);
      rightGlass.position.x = 0.7;
      group.add(rightGlass);

      // Köprü
      const bridgeGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
      const bridge = new THREE.Mesh(bridgeGeom, material);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.x = 0;
      group.add(bridge);

      // Saplar
      const templeGeom = new THREE.BoxGeometry(0.05, 0.05, 1.5);
      const leftTemple = new THREE.Mesh(templeGeom, material);
      leftTemple.position.set(-1.2, 0, -0.75);
      group.add(leftTemple);

      const rightTemple = new THREE.Mesh(templeGeom, material);
      rightTemple.position.set(1.2, 0, -0.75);
      group.add(rightTemple);

      return group;
    };

    const onResults = (results: any) => {
      if (!canvasRef.current || !videoRef.current || !renderer || !camera) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        renderer.setSize(canvas.width, canvas.height);
        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
      }

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        glasses.visible = true;
        const landmarks = results.multiFaceLandmarks[0];

        const midEyes = landmarks[168];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const forehead = landmarks[10];
        const chin = landmarks[152];

        const x = (midEyes.x - 0.5) * 2;
        const y = -(midEyes.y - 0.5) * 2;
        const z = -midEyes.z * 5;

        const eyeDist = Math.sqrt(
          Math.pow(rightEye.x - leftEye.x, 2) + 
          Math.pow(rightEye.y - leftEye.y, 2)
        );
        const scale = eyeDist * 5;
        glasses.scale.set(scale, scale, scale);

        const vFOV = (camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z - z);
        const width = height * camera.aspect;

        glasses.position.set(x * (width / 2), y * (height / 2), z);

        const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
        const pitch = Math.atan2(midEyes.z - forehead.z, midEyes.y - forehead.y) * 0.5;
        const yaw = Math.atan2(rightEye.z - leftEye.z, rightEye.x - leftEye.x) * 1.5;

        glasses.rotation.set(pitch, -yaw, -roll);

      } else {
        glasses.visible = false;
      }

      renderer.render(scene, camera);
    };

    init();

    return () => {
      if (faceMesh) faceMesh.close();
      if (mediaPipeCamera) mediaPipeCamera.stop();
      if (renderer) renderer.dispose();
    };
  }, [scriptsLoaded]);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] bg-black rounded-2xl overflow-hidden shadow-2xl">
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" 
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, faceMesh: true }))}
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" 
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, camera: true }))}
      />

      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-medium">Sanal Deneme Modülü Hazırlanıyor...</p>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
        playsInline
        muted
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none transform scale-x-[-1]"
      />
      
      <div className="absolute top-4 right-4 z-30">
        <button 
          onClick={onClose}
          className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full backdrop-blur-md transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-6 py-2 rounded-full backdrop-blur-sm z-30 whitespace-nowrap">
        {product?.brand} {product?.name} - Canlı 3D Deneme
      </div>
    </div>
  );
}
