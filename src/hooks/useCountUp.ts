import { useEffect, useState } from 'react';

export function useCountUp(
  targetValue: number,
  durationMs = 1200,
  shouldAnimate = true
): number {
  const [displayValue, setDisplayValue] = useState(shouldAnimate ? 0 : targetValue);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayValue(targetValue);
      return;
    }

    const startTime = performance.now();
    const startValue = 0;
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (targetValue - startValue) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, durationMs, shouldAnimate]);

  return displayValue;
}
