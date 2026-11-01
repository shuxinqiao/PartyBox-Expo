import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { COLORS } from '@/theme/colors';

export function CharadesArtwork() {
  return (
    <View style={styles.charadesWrap} pointerEvents="none">
      <LinearGradient
        colors={['#FFADD9', COLORS.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.wordCard}>
        <Text style={styles.questionMark}>?</Text>
      </LinearGradient>
      <View style={styles.starBubble}>
        <Text style={styles.star}>✦</Text>
      </View>
    </View>
  );
}

export function WavelengthArtwork() {
  return (
    <View pointerEvents="none">
      <Svg width={134} height={116} viewBox="0 0 134 116">
        <Path
          d="M 10 102 A 57 57 0 0 1 124 102"
          stroke="rgba(255,255,255,0.19)"
          strokeWidth={11}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 10 102 A 57 57 0 0 1 67 45"
          stroke={COLORS.purple}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 67 45 A 57 57 0 0 1 124 102"
          stroke={COLORS.cyan}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
        <Line x1={67} y1={102} x2={93} y2={51} stroke={COLORS.cyan} strokeWidth={3.5} strokeLinecap="round" />
        <Circle cx={67} cy={102} r={8} fill={COLORS.cyan} />
        <Circle cx={67} cy={102} r={2.6} fill="#FFFFFF" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  charadesWrap: { width: 126, height: 124, alignItems: 'center', justifyContent: 'center' },
  wordCard: {
    height: 110,
    width: 83,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-13deg' }],
  },
  questionMark: { fontSize: 65, fontWeight: '900', color: '#FFFFFF' },
  starBubble: {
    position: 'absolute',
    right: 1,
    top: 0,
    width: 33,
    height: 33,
    borderRadius: 20,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: { color: COLORS.background, fontSize: 22, fontWeight: '800' },
});
