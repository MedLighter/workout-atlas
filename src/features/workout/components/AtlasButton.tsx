import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../shared/ui/AppText';

interface AtlasButtonProps {
  onPress: () => void;
  compact?: boolean;
}

export function AtlasButton({ onPress, compact }: AtlasButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 active:bg-emerald-500/20 ${
        compact ? 'px-2 py-1' : 'px-3 py-1.5'
      }`}
    >
      <Ionicons name="map-outline" size={compact ? 14 : 16} color="#34D399" />
      <AppText variant="caption" className="text-emerald-400 text-[11px]">
        Atlas
      </AppText>
    </Pressable>
  );
}