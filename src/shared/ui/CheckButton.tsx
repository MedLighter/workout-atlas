import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckButtonProps {
  checked: boolean;
  onPress: () => void;
}

export function CheckButton({ checked, onPress }: CheckButtonProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      className={`w-10 h-10 rounded-full border items-center justify-center ${
        checked
          ? 'bg-emerald-500/20 border-emerald-500'
          : 'bg-zinc-900 border-zinc-700'
      }`}
    >
      {checked ? (
        <Ionicons name="checkmark" size={18} color="#10B981" />
      ) : (
        <Ionicons name="ellipse-outline" size={18} color="#71717A" />
      )}
    </Pressable>
  );
}