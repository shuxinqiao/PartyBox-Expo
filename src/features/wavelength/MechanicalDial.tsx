import * as Haptics from 'expo-haptics';
import { memo, useCallback, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { type SharedValue, useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Line, Path, Stop, Text as SvgText } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import {
  DIAL_CENTER_X,
  DIAL_CENTER_Y,
  DIAL_STEP,
  DIAL_HEIGHT,
  DIAL_WIDTH,
  FACE_RADIUS,
  TARGET_HALF_WIDTH,
  clamp,
  dialPoint,
  dialValueForTouch,
  wedgePath,
} from './dialGeometry';

type DialMode = 'target' | 'hidden' | 'reveal';
type Props = {
  value: number;
  mode: DialMode;
  targetCenter: number;
  width: number;
  label: string;
  onChange: (value: number) => void;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const ARC_RADIUS = 173;
const FACE_PATH = `M ${DIAL_CENTER_X - FACE_RADIUS} ${DIAL_CENTER_Y} A ${FACE_RADIUS} ${FACE_RADIUS} 0 0 1 ${DIAL_CENTER_X + FACE_RADIUS} ${DIAL_CENTER_Y} Z`;
const RIM_PATH = `M ${DIAL_CENTER_X - ARC_RADIUS} ${DIAL_CENTER_Y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${DIAL_CENTER_X + ARC_RADIUS} ${DIAL_CENTER_Y}`;

const GEAR_TEETH = Array.from({ length: 38 }, (_, index) => ({
  inside: dialPoint((index * 100) / 37, 180),
  outside: dialPoint((index * 100) / 37, 191),
  index,
}));

const RIM_NOTCHES = Array.from({ length: 51 }, (_, index) => ({
  inside: dialPoint(index * 2, 159),
  outside: dialPoint(index * 2, index % 5 === 0 ? 168 : 164),
  index,
}));

const BANDS = [
  { from: -10, to: -6, color: '#F7B82D' },
  { from: -6, to: -2, color: '#FF7029' },
  { from: -2, to: 2, color: '#ED3349' },
  { from: 2, to: 6, color: '#FF7029' },
  { from: 6, to: 10, color: '#F7B82D' },
] as const;

function ScoreWedge({
  center,
  from,
  to,
  color,
}: {
  center: SharedValue<number>;
  from: number;
  to: number;
  color: string;
}) {
  const animatedProps = useAnimatedProps(() => ({ d: wedgePath(center.value, from, to) }));
  return <AnimatedPath animatedProps={animatedProps} fill={color} />;
}

function ScoreLabel({
  center,
  offset,
  score,
}: {
  center: SharedValue<number>;
  offset: number;
  score: string;
}) {
  const animatedProps = useAnimatedProps(() => {
    const position = center.value + offset;
    const point = dialPoint(clamp(position, 0, 100), FACE_RADIUS - 25);
    return { x: point.x, y: point.y + 5, opacity: position >= 0 && position <= 100 ? 1 : 0 };
  });

  return (
    <AnimatedSvgText
      animatedProps={animatedProps}
      fill="#3D2930"
      fontSize={14}
      fontWeight="900"
      textAnchor="middle">
      {score}
    </AnimatedSvgText>
  );
}

export const MechanicalDial = memo(function MechanicalDial({
  value,
  mode,
  targetCenter,
  width,
  label,
  onChange,
}: Props) {
  const position = useSharedValue(value);
  const lastPosition = useSharedValue(value);
  const lastHapticAt = useRef(0);

  const hapticNotch = useCallback(() => {
    const now = Date.now();
    if (now - lastHapticAt.current < 40) return;
    lastHapticAt.current = now;

    const feedback = Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick)
      : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    void feedback.catch(() => {});
  }, []);

  const updateFromTouch = (x: number, y: number) => {
    'worklet';
    const actualWidth = width;
    if (actualWidth <= 0) return;
    const touched = dialValueForTouch((x * DIAL_WIDTH) / actualWidth, (y * DIAL_WIDTH) / actualWidth);
    if (touched < 0) return;
    // Keep all five equal-width scoring sectors visible at either end.
    const next = mode === 'target' ? clamp(touched, TARGET_HALF_WIDTH, 100 - TARGET_HALF_WIDTH) : touched;
    if (Math.abs(next - lastPosition.value) < 0.12) return;

    const previousNotch = Math.round(lastPosition.value / 4);
    const nextNotch = Math.round(next / 4);
    lastPosition.value = next;
    // UI-thread direct tracking: no 66 ms chase animation while dragging.
    position.value = next;
    if (previousNotch !== nextNotch) scheduleOnRN(hapticNotch);
  };

  const gesture = usePanGesture({
    enabled: mode !== 'reveal',
    minDistance: 0,
    onActivate: (event) => {
      updateFromTouch(event.x, event.y);
    },
    onUpdate: (event) => {
      updateFromTouch(event.x, event.y);
    },
    onDeactivate: () => {
      const snapped = clamp(Math.round(lastPosition.value / DIAL_STEP) * DIAL_STEP, 0, 100);
      position.value = withTiming(snapped, { duration: 75 });
      lastPosition.value = snapped;
      scheduleOnRN(onChange, snapped);
    },
  });

  const bandCenter = useDerivedValue(() => (mode === 'target' ? position.value : targetCenter));
  const pointerLine = useAnimatedProps(() => {
    const tip = dialPoint(position.value, FACE_RADIUS - 15);
    return { x2: tip.x, y2: tip.y };
  });
  const pointerTip = useAnimatedProps(() => {
    const tip = dialPoint(position.value, FACE_RADIUS - 15);
    return { cx: tip.x, cy: tip.y };
  });

  const showTarget = mode !== 'hidden';

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: 100, now: value }}
        style={[styles.dialContainer, { width }]}>
        <Svg viewBox={`0 0 ${DIAL_WIDTH} ${DIAL_HEIGHT}`} width="100%" height="100%" pointerEvents="none">
          <Defs>
            <LinearGradient id="housingPaint" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#33323B" />
              <Stop offset="65%" stopColor="#1C1E26" />
              <Stop offset="100%" stopColor="#0C0E15" />
            </LinearGradient>
            <LinearGradient id="facePaint" x1="0%" y1="0%" x2="25%" y2="100%">
              <Stop offset="0%" stopColor="#F8EEDD" />
              <Stop offset="100%" stopColor="#D6BCA0" />
            </LinearGradient>
            <LinearGradient id="redNeedle" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#7A0B21" />
              <Stop offset="37%" stopColor="#FC334E" />
              <Stop offset="70%" stopColor="#E81937" />
              <Stop offset="100%" stopColor="#8E1028" />
            </LinearGradient>
            <LinearGradient id="hubPaint" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FF4860" />
              <Stop offset="52%" stopColor="#E51B35" />
              <Stop offset="100%" stopColor="#9D0B24" />
            </LinearGradient>
          </Defs>

          {GEAR_TEETH.map((tooth) => (
            <Line
              key={`tooth-${tooth.index}`}
              x1={tooth.inside.x}
              y1={tooth.inside.y}
              x2={tooth.outside.x}
              y2={tooth.outside.y}
              stroke={tooth.index % 2 === 0 ? '#E4CBAC' : '#D2B593'}
              strokeWidth={12}
              strokeLinecap="round"
            />
          ))}

          <Path
            d="M 27 206 Q 200 195 373 206 L 366 284 Q 360 303 339 307 L 61 307 Q 40 303 34 284 Z"
            fill="url(#housingPaint)"
            stroke="#484852"
            strokeWidth={3}
          />

          <Path d={RIM_PATH} stroke="#17191F" strokeWidth={31} fill="none" strokeLinecap="round" />
          <Path d={RIM_PATH} stroke="#47464A" strokeWidth={3} fill="none" opacity={0.68} />
          <Path d={FACE_PATH} fill="url(#facePaint)" />

          {showTarget && (
            <>
              {BANDS.map((band) => (
                <ScoreWedge key={band.from} center={bandCenter} from={band.from} to={band.to} color={band.color} />
              ))}
              <ScoreLabel center={bandCenter} offset={-8} score="2" />
              <ScoreLabel center={bandCenter} offset={-4} score="3" />
              <ScoreLabel center={bandCenter} offset={0} score="4" />
              <ScoreLabel center={bandCenter} offset={4} score="3" />
              <ScoreLabel center={bandCenter} offset={8} score="2" />
            </>
          )}

          <Path d={RIM_PATH} stroke="#2D2D33" strokeWidth={17} fill="none" />
          {RIM_NOTCHES.map((notch) => (
            <Line
              key={`mark-${notch.index}`}
              x1={notch.inside.x}
              y1={notch.inside.y}
              x2={notch.outside.x}
              y2={notch.outside.y}
              stroke={notch.index % 5 === 0 ? '#AFA5A0' : '#69666B'}
              strokeWidth={notch.index % 5 === 0 ? 2 : 1}
              opacity={0.85}
            />
          ))}

          {mode !== 'target' && (
            <>
              <AnimatedLine
                x1={DIAL_CENTER_X + 3}
                y1={DIAL_CENTER_Y + 2}
                animatedProps={pointerLine}
                stroke="#3B0716"
                strokeWidth={10}
                strokeLinecap="round"
                opacity={0.35}
              />
              <AnimatedLine
                x1={DIAL_CENTER_X}
                y1={DIAL_CENTER_Y}
                animatedProps={pointerLine}
                stroke="url(#redNeedle)"
                strokeWidth={7}
                strokeLinecap="round"
              />
              <AnimatedCircle animatedProps={pointerTip} r={5} fill="#FA3A53" stroke="#AF132C" strokeWidth={1.5} />
            </>
          )}

          <Circle cx={DIAL_CENTER_X + 3} cy={DIAL_CENTER_Y + 5} r={43} fill="#06070E" opacity={0.38} />
          <Circle cx={DIAL_CENTER_X} cy={DIAL_CENTER_Y} r={40} fill="#8B1128" />
          <Circle cx={DIAL_CENTER_X} cy={DIAL_CENTER_Y} r={36} fill="url(#hubPaint)" stroke="#B81832" strokeWidth={3} />
          <Circle cx={DIAL_CENTER_X - 9} cy={DIAL_CENTER_Y - 12} r={18} fill="#FF7990" opacity={0.1} />
          <Path d="M 57 263 Q 200 278 343 263" stroke="#60626B" strokeWidth={1} opacity={0.35} fill="none" />
          <Circle cx={63} cy={286} r={3} fill="#7A7B81" opacity={0.75} />
          <Circle cx={337} cy={286} r={3} fill="#7A7B81" opacity={0.75} />
        </Svg>
      </View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  dialContainer: {
    aspectRatio: DIAL_WIDTH / DIAL_HEIGHT,
    alignSelf: 'center',
  },
});
