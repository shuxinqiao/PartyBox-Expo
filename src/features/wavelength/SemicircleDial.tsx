import { memo, useCallback, useRef } from 'react';
import { type GestureResponderEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Line, Path, Stop } from 'react-native-svg';

import { COLORS } from '@/theme/colors';

const WIDTH = 360;
const HEIGHT = 242;
const CX = WIDTH / 2;
const CY = 191;
const RADIUS = 136;
const NEEDLE_LENGTH = 119;

type Props = {
  value: number; // 0 = left, 50 = top, 100 = right.
  onChange: (value: number) => void;
  disabled?: boolean;
  accessibilityLabel: string;
};

function pointAt(percent: number, radius: number) {
  const angle = Math.PI * (1 - percent / 100);
  return {
    x: CX + radius * Math.cos(angle),
    y: CY - radius * Math.sin(angle),
  };
}

const FULL_ARC = `M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`;
const HALF_DISC = `${FULL_ARC} L ${CX - RADIUS} ${CY} Z`;

function progressArc(value: number) {
  if (value <= 0) return '';
  const end = pointAt(value, RADIUS);
  return `M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`;
}

const TICKS = Array.from({ length: 21 }, (_, index) => {
  const value = index * 5;
  const isMajor = index % 5 === 0;
  return {
    value,
    isMajor,
    inner: pointAt(value, isMajor ? 151 : 155),
    outer: pointAt(value, 163),
  };
});

export const SemicircleDial = memo(function SemicircleDial({
  value,
  onChange,
  disabled = false,
  accessibilityLabel,
}: Props) {
  const layout = useRef({ width: WIDTH, height: HEIGHT });
  const tip = pointAt(value, NEEDLE_LENGTH);

  const handlePointer = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;

      // Convert local touch coordinates into the fixed SVG viewBox.
      const x = (event.nativeEvent.locationX / layout.current.width) * WIDTH;
      const y = (event.nativeEvent.locationY / layout.current.height) * HEIGHT;

      // Ignore the lower semicircle: below the baseline, pick the nearest end.
      const angle = Math.atan2(Math.max(0, CY - y), x - CX);
      const next = Math.max(0, Math.min(100, Math.round(100 * (1 - angle / Math.PI))));
      onChange(next);
    },
    [disabled, onChange]
  );

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: 0, max: 100, now: value }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width > 0 && height > 0) layout.current = { width, height };
      }}
      onStartShouldSetResponder={() => !disabled}
      onMoveShouldSetResponder={() => !disabled}
      onResponderGrant={handlePointer}
      onResponderMove={handlePointer}
      onResponderTerminationRequest={() => false}
      style={styles.container}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} pointerEvents="none">
        <Defs>
          <LinearGradient id="dialDisc" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.purple} stopOpacity="0.24" />
            <Stop offset="100%" stopColor={COLORS.background} stopOpacity="0.05" />
          </LinearGradient>
          <LinearGradient id="dialArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={COLORS.cyan} />
            <Stop offset="50%" stopColor={COLORS.purple} />
            <Stop offset="100%" stopColor={COLORS.pink} />
          </LinearGradient>
        </Defs>

        <Path d={HALF_DISC} fill="url(#dialDisc)" />
        <Path d={FULL_ARC} stroke={COLORS.purple} strokeWidth={27} opacity={0.1} fill="none" />
        <Path d={FULL_ARC} stroke="#57466F" strokeWidth={15} strokeLinecap="round" fill="none" />

        {TICKS.map((tick) => (
          <Line
            key={tick.value}
            x1={tick.inner.x}
            y1={tick.inner.y}
            x2={tick.outer.x}
            y2={tick.outer.y}
            stroke={tick.value <= value ? COLORS.cyan : '#706580'}
            strokeWidth={tick.isMajor ? 3 : 1.5}
            strokeLinecap="round"
            opacity={tick.isMajor ? 0.95 : 0.6}
          />
        ))}

        {value > 0 && (
          <>
            <Path d={progressArc(value)} stroke="url(#dialArc)" strokeWidth={22} opacity={0.22} strokeLinecap="round" fill="none" />
            <Path d={progressArc(value)} stroke="url(#dialArc)" strokeWidth={10} strokeLinecap="round" fill="none" />
          </>
        )}

        <Line x1={CX} y1={CY} x2={tip.x} y2={tip.y} stroke={COLORS.pink} strokeWidth={15} opacity={0.12} strokeLinecap="round" />
        <Line x1={CX} y1={CY} x2={tip.x} y2={tip.y} stroke={COLORS.white} strokeWidth={6} strokeLinecap="round" />
        <Circle cx={tip.x} cy={tip.y} r={14} fill={COLORS.pink} opacity={0.22} />
        <Circle cx={tip.x} cy={tip.y} r={7} fill={COLORS.white} stroke={COLORS.pink} strokeWidth={2.5} />
        <Circle cx={CX} cy={CY} r={21} fill={COLORS.background} stroke={COLORS.purple} strokeWidth={5} />
        <Circle cx={CX} cy={CY} r={8} fill={COLORS.pink} />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: WIDTH / HEIGHT,
  },
});
