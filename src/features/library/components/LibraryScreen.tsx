import { FlatList, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '../../../shared/ui/AppScreen';
import { AppText } from '../../../shared/ui/AppText';
import { useWorkoutStore } from '../../workout/model/workout.store';

export function LibraryScreen() {
  const router = useRouter();
  const templates = useWorkoutStore((s) => s.templates);
  const completedSessions = useWorkoutStore((s) => s.completedSessions);
  const setCurrentSession = useWorkoutStore((s) => s.setCurrentSession);

  const sections = [
    { title: 'Шаблоны', data: templates },
    { title: 'Недавние', data: completedSessions.slice(0, 5) },
  ];

  return (
    <AppScreen>
      <AppText variant="title" className="mb-1">
        Библиотека
      </AppText>
      <AppText variant="body" muted className="mb-5">
        Шаблоны и импортированные тренировки
      </AppText>

      {sections.map((section) => (
        <View key={section.title} className="mb-6">
          <AppText variant="section" className="mb-3">
            {section.title}
          </AppText>
          {section.data.length === 0 ? (
            <AppText variant="body" muted>
              Пока пусто
            </AppText>
          ) : (
            <FlatList
              data={section.data}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setCurrentSession(item);
                    router.push('/(tabs)');
                  }}
                  className="mb-2 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 active:bg-zinc-800"
                >
                  <AppText variant="row">{item.title}</AppText>
                  <AppText variant="caption" muted>
                    {item.exercises.length} упражнений · {item.date}
                  </AppText>
                </Pressable>
              )}
            />
          )}
        </View>
      ))}
    </AppScreen>
  );
}