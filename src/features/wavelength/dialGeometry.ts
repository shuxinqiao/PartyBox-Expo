export const DIAL_WIDTH = 400;
export const DIAL_HEIGHT = 316;
export const DIAL_CENTER_X = 200;
export const DIAL_CENTER_Y = 212;
export const FACE_RADIUS = 160;
export const DIAL_STEP = 2;
export const TARGET_HALF_WIDTH = 10;

export function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.max(min, Math.min(max, value));
}

/** 0 = left, 50 = top, 100 = right. */
export function dialPoint(value: number, radius: number) {
  'worklet';
  const angle = (Math.PI * (100 - value)) / 100;
  return {
    x: DIAL_CENTER_X + radius * Math.cos(angle),
    y: DIAL_CENTER_Y - radius * Math.sin(angle),
  };
}

/** Returns -1 for touches outside the selectable upper dial face. */
export function dialValueForTouch(x: number, y: number): number {
  'worklet';
  const dx = x - DIAL_CENTER_X;
  const dy = y - DIAL_CENTER_Y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Leave the red hub and the black lower housing outside the hit area.
  if (y > DIAL_CENTER_Y + 5 || distance < 52 || distance > 190) return -1;

  const angle = Math.atan2(Math.max(0, -dy), dx);
  const percent = 100 * (1 - angle / Math.PI);
  // Track the finger continuously. Snapping is only applied on release.
  return clamp(percent, 0, 100);
}

/** The five symmetric Wavelength-style scoring wedges. */
export function wedgePath(center: number, fromOffset: number, toOffset: number): string {
  'worklet';
  const start = clamp(center + fromOffset, 0, 100);
  const end = clamp(center + toOffset, 0, 100);
  if (end - start < 0.01) return '';

  const first = dialPoint(start, FACE_RADIUS - 3);
  const last = dialPoint(end, FACE_RADIUS - 3);
  return `M ${DIAL_CENTER_X} ${DIAL_CENTER_Y} L ${first.x} ${first.y} A ${FACE_RADIUS - 3} ${FACE_RADIUS - 3} 0 0 1 ${last.x} ${last.y} Z`;
}

export function scoreForGuess(target: number, guess: number) {
  const distance = Math.abs(target - guess);
  if (distance <= 2) return 4;
  if (distance <= 6) return 3;
  if (distance <= TARGET_HALF_WIDTH) return 2;
  return 0;
}
