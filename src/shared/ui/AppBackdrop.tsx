import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/tokens';

export function AppBackdrop() {
  return (
    <View style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <LinearGradient
        colors={[colors.bgSecondary, colors.bgPrimary, '#030607']}
        locations={[0, 0.48, 1]}
        style={{ position: 'absolute', inset: 0 }}
      />
      <View
        style={{
          position: 'absolute',
          width: 290,
          height: 290,
          borderRadius: 999,
          top: -185,
          right: -135,
          backgroundColor: 'rgba(24,212,155,0.06)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: 999,
          bottom: -160,
          left: -130,
          backgroundColor: 'rgba(24,212,155,0.035)',
        }}
      />
    </View>
  );
}
