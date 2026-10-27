import { useEffect, useState, useCallback } from 'react';

export interface DeviceTilt {
  tiltX: number; // -1 to 1 (gamma)
  tiltY: number; // -1 to 1 (beta)
  isSupported: boolean;
  permissionState: 'granted' | 'denied' | 'prompt' | 'unsupported';
  requestPermission: () => Promise<void>;
}

export function useDeviceTilt(): DeviceTilt {
  const [tilt, setTilt] = useState<{ tiltX: number; tiltY: number }>({ tiltX: 0, tiltY: 0 });
  const [isSupported, setIsSupported] = useState(false);
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('unsupported');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('DeviceOrientationEvent' in window) {
      setIsSupported(true);
      // Check if iOS 13+ permission is required
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setPermissionState('prompt');
      } else {
        setPermissionState('granted');
      }
    }
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // gamma: left-to-right tilt in degrees [-90, 90]
    // beta: front-to-back tilt in degrees [-180, 180]
    const gamma = event.gamma || 0;
    const beta = event.beta || 0;

    // Normalize roughly to [-1, 1] with comfortable tilt range [-35, 35]
    const normX = Math.min(Math.max(gamma / 35, -1), 1);
    const normY = Math.min(Math.max((beta - 45) / 35, -1), 1);

    setTilt({ tiltX: normX, tiltY: normY });
  }, []);

  const requestPermission = useCallback(async () => {
    if (
      typeof window !== 'undefined' &&
      'DeviceOrientationEvent' in window &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          setPermissionState('denied');
        }
      } catch {
        setPermissionState('denied');
      }
    }
  }, [handleOrientation]);

  useEffect(() => {
    if (permissionState === 'granted') {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [permissionState, handleOrientation]);

  return {
    tiltX: tilt.tiltX,
    tiltY: tilt.tiltY,
    isSupported,
    permissionState,
    requestPermission,
  };
}
