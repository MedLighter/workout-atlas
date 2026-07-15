import { Pressable, View } from 'react-native';
import { AppText } from '../../../shared/ui/AppText';
import { colors } from '../../../shared/theme/tokens';
import type { WorkoutSet } from '../../workout/model/workout.types';

interface SetProgressProps {
  sets: WorkoutSet[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function SetProgress({ sets, activeIndex, onSelect }: SetProgressProps) {
  return (
    <View className="items-center">
      <AppText variant="bodyM" className="mb-3 text-content-secondary">
        Подход {activeIndex + 1} из {sets.length}
      </AppText>
      <View className="flex-row gap-1.5">
        {sets.map((set, index) => {
          const isCompleted = set.completed;
          const isActive = index === activeIndex && !isCompleted;
          const isFuture = !isCompleted && index > activeIndex;

          const dotColor = isCompleted
            ? colors.accentPrimary
            : isActive
              ? colors.accentPrimary
              : colors.borderStrong;

          return (
            <Pressable
              key={set.id}
              accessibilityLabel={`Подход ${index + 1}`}
              onPress={() => onSelect(index)}
              className="items-center justify-center"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <View
                style={{
                  width: 24,
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: isFuture ? colors.borderStrong : dotColor,
                  borderWidth: 0,
                  opacity: isCompleted ? 0.6 : 1,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
