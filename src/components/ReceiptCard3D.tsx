import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CardRenderOptions } from '../lib/cardCanvas';
import { drawReceiptFront, drawReceiptBack } from '../lib/cardCanvas';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useDeviceTilt } from '../hooks/useDeviceTilt';
import { RotateCcw, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReceiptCard3DProps {
  options: CardRenderOptions;
  onStampLanding?: () => void;
}

/**
 * Inner 3D Card mesh running within R3F Canvas
 */
function CardMesh({
  frontTexture,
  backTexture,
  isFlipped,
  deviceTiltX,
  deviceTiltY,
}: {
  frontTexture: THREE.CanvasTexture;
  backTexture: THREE.CanvasTexture;
  isFlipped: boolean;
  deviceTiltX: number;
  deviceTiltY: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });

  // Floating idle offset
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Base target includes device tilt or gentle float
    let desiredY = isFlipped ? Math.PI : 0;
    let desiredX = 0;

    if (!isDragging.current) {
      if (Math.abs(deviceTiltX) > 0.05 || Math.abs(deviceTiltY) > 0.05) {
        desiredY += deviceTiltX * 0.45;
        desiredX += -deviceTiltY * 0.35;
      } else {
        // Idle breathing float
        desiredY += Math.sin(t * 0.8) * 0.08;
        desiredX += Math.cos(t * 1.1) * 0.05;
      }
    }

    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, desiredX, 0.08);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, desiredY, 0.08);

    meshRef.current.rotation.x = targetRotation.current.x;
    meshRef.current.rotation.y = targetRotation.current.y;
    meshRef.current.position.y = Math.sin(t * 1.5) * 0.05;
  });

  // Pointer drag to spin card
  const handlePointerDown = (e: any) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current || !meshRef.current) return;
    const deltaX = e.clientX - prevPointer.current.x;
    const deltaY = e.clientY - prevPointer.current.y;
    prevPointer.current = { x: e.clientX, y: e.clientY };

    targetRotation.current.y += deltaX * 0.008;
    targetRotation.current.x += deltaY * 0.008;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Front Face: Thermal Paper Receipt with subtle sheen */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[2.5, 4.3]} />
        <meshPhysicalMaterial
          map={frontTexture}
          roughness={0.4}
          metalness={0.05}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          reflectivity={0.5}
        />
      </mesh>

      {/* Back Face: Clean QR & Security Hologram */}
      <mesh position={[0, 0, -0.015]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.5, 4.3]} />
        <meshPhysicalMaterial
          map={backTexture}
          roughness={0.35}
          metalness={0.1}
          clearcoat={0.4}
        />
      </mesh>

      {/* Card Core / Physical paper thickness edges */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 4.3, 0.028]} />
        <meshStandardMaterial color="#E8E1D7" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * 2D Static Receipt Fallback for reduced-motion or low-spec devices
 */
function StaticReceiptCard({ options }: { options: CardRenderOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 480;
    const h = 760;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    if (flipped) {
      drawReceiptBack(ctx, w, h, options);
    } else {
      drawReceiptFront(ctx, w, h, options);
    }
  }, [options, flipped]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative shadow-2xl rounded-xl overflow-hidden border border-[#D9D1C5] max-w-[420px] w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
          style={{ imageRendering: 'crisp-edges' }}
        />
      </div>
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="mt-3 px-3 py-1.5 bg-[#18191E] border border-[#2B2E38] rounded font-mono text-xs text-[#EAECEF] hover:text-[#FF3B1E] transition-colors cursor-pointer"
      >
        {flipped ? 'Show Front Statement' : 'Flip to Itemized Details'}
      </button>
    </div>
  );
}

export const ReceiptCard3D: React.FC<ReceiptCard3DProps> = ({
  options,
  onStampLanding,
}) => {
  const prefersReduced = useReducedMotion();
  const { tiltX, tiltY, isSupported, permissionState, requestPermission } = useDeviceTilt();
  const [isFlipped, setIsFlipped] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  // Generate crisp textures from offscreen 2D canvas
  const frontTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 1650;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawReceiptFront(ctx, 960, 1650, options);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }, [options]);

  const backTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 1650;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawReceiptBack(ctx, 960, 1650, options);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }, [options]);

  // Entrance stamp slam animation with screen shake and sound-free haptic
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreenShake(true);

      // Sound-free haptic feedback where supported (vibration API)
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate([35, 25, 45]);
        } catch {
          // ignore
        }
      }

      // Small confetti burst for viral celebration
      try {
        confetti({
          particleCount: 28,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#FF3B1E', '#D92D20', '#F5EFEB'],
        });
      } catch {
        // ignore
      }

      onStampLanding?.();

      setTimeout(() => setScreenShake(false), 300);
    }, 700);

    return () => clearTimeout(timer);
  }, [options, onStampLanding]);

  if (prefersReduced) {
    return <StaticReceiptCard options={options} />;
  }

  return (
    <div className={`relative flex flex-col items-center justify-center transition-transform ${screenShake ? 'animate-bounce' : ''}`}>
      {/* 3D Scene Container */}
      <div className="relative w-full max-w-[380px] h-[460px] sm:h-[500px] cursor-grab active:cursor-grabbing select-none">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 46 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 8, 6]} intensity={1.8} castShadow />
          <directionalLight position={[-4, -4, 3]} intensity={0.6} color="#FFE6D5" />
          <pointLight position={[0, 0, 4]} intensity={0.8} />

          <Suspense fallback={null}>
            <CardMesh
              frontTexture={frontTexture}
              backTexture={backTexture}
              isFlipped={isFlipped}
              deviceTiltX={tiltX}
              deviceTiltY={tiltY}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {/* Flip Card Toggle */}
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2 bg-[#18191E] hover:bg-[#22242C] border border-[#2B2E38] rounded-lg font-mono text-xs text-[#EAECEF] flex items-center space-x-2 transition-all cursor-pointer active:scale-95 shadow"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#FF3B1E]" />
          <span>{isFlipped ? 'Show Front Statement' : 'Flip Card (View Itemized Details)'}</span>
        </button>

        {/* Mobile Device Tilt Enabler */}
        {isSupported && permissionState === 'prompt' && (
          <button
            type="button"
            onClick={requestPermission}
            className="px-4 py-2 bg-[#18191E] hover:bg-[#22242C] border border-[#2B2E38] rounded-lg font-mono text-xs text-[#EAECEF] flex items-center space-x-2 transition-all cursor-pointer active:scale-95 shadow"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FF3B1E]" />
            <span>Enable 3D Tilt</span>
          </button>
        )}

        <div className="font-mono text-[11px] text-[#888E9E] hidden sm:block">
          • Drag card to rotate / Flip for itemized details
        </div>
      </div>
    </div>
  );
};
