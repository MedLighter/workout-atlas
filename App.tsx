import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Workout Atlas</Text>
      <Text style={styles.title}>Тренировки</Text>
      <Text style={styles.subtitle}>Стартовый экран проекта. Здесь появится атлас упражнений и планов.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070A0F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  eyebrow: {
    color: '#4D8DFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F5F7FA',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#8A93A3',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});