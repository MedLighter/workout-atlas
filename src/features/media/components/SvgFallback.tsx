import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { View } from 'react-native';
import { AppText } from '../../../shared/ui/AppText';

interface SvgFallbackProps {
  label?: string;
  height?: number;
}

export function SvgFallback({ label = 'Нет изображения', height = 120 }: SvgFallbackProps) {
  return (
    <View
      className="bg-zinc-900 border border-zinc-800 rounded-xl items-center justify-center overflow-hidden"
      style={{ height }}
    >
      <Svg width="100%" height={height} viewBox="0 0 200 120">
        <Rect x="1" y="1" width="198" height="118" fill="none" stroke="#3F3F46" strokeWidth="1" />
        <Circle cx="100" cy="42" r="14" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <Path
          d="M100 56 L100 78 M82 66 L118 66 M90 92 L100 78 L110 92"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Line x1="24" y1="100" x2="176" y2="100" stroke="#27272A" strokeWidth="1" />
      </Svg>
      <AppText variant="caption" muted className="absolute bottom-2">
        {label}
      </AppText>
    </View>
  );
}