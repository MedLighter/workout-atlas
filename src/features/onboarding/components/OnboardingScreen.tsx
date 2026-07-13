import { useRef, useState } from 'react';
import { Dimensions, FlatList, View, type ViewToken } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppScreen } from '../../../shared/ui/AppScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { TrackingModePicker } from '../../../shared/ui/TrackingModePicker';
import { useSettingsStore } from '../../settings/model/settings.store';
import { useWorkoutStore } from '../../workout/model/workout.store';
import type { TrackingMode } from '../../workout/model/workout.types';

const { width } = Dimensions.get('window');

type SlideKind = 'intro' | 'tracking' | 'atlas' | 'schedule' | 'import' | 'start';

interface Slide {
  id: string;
  kind: SlideKind;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: '1',
    kind: 'intro',
    title: 'Твой атлас нагрузки',
    subtitle: 'Тренировки по плану, отметки без лишнего шума, глубокая аналитика по запросу.',
  },
  {
    id: '2',
    kind: 'tracking',
    title: 'Как отмечать тренировки?',
    subtitle: 'Выбери стиль — всегда можно поменять в настройках.',
  },
  {
    id: '3',
    kind: 'atlas',
    title: 'Atlas Layer',
    subtitle: 'Кнопка Atlas у каждого упражнения — карта мышц, техника, история и 1ПМ.',
  },
  {
    id: '4',
    kind: 'schedule',
    title: 'План на неделю',
    subtitle: 'Full Body 3x: Пн / Ср / Пт — тренировки, остальные дни отдых.',
  },
  {
    id: '5',
    kind: 'import',
    title: 'Импорт из AI',
    subtitle: 'Вставь JSON или Markdown — увидь превью и импортируй.',
  },
  {
    id: '6',
    kind: 'start',
    title: 'Готов начать?',
    subtitle: 'Демо-тренировка, импорт или пустой старт.',
  },
];

function IntroIllustration() {
  return (
    <Svg width={width - 80} height={180} viewBox="0 0 280 180">
      <Rect x="1" y="1" width="278" height="178" fill="none" stroke="#27272A" strokeWidth="1" />
      <Circle cx="140" cy="36" r="16" fill="none" stroke="#10B981" strokeWidth="1.5" />
      <Path d="M140 52 L140 95 M108 70 L172 70 M118 120 L140 95 L162 120 M118 120 L118 155 M162 120 L162 155" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M125 95 L155 95 L150 110 L130 110 Z" fill="#064E3B" stroke="#10B981" strokeWidth="1" opacity="0.5" />
    </Svg>
  );
}

function AtlasIllustration() {
  return (
    <Svg width={width - 80} height={180} viewBox="0 0 280 180">
      <Rect x="30" y="30" width="220" height="120" fill="#18181B" stroke="#10B981" strokeWidth="1.5" rx="8" />
      <Circle cx="90" cy="80" r="28" fill="none" stroke="#34D399" strokeWidth="1.5" />
      <Path d="M90 52 L90 108 M72 70 L108 70" stroke="#34D399" strokeWidth="1" />
      <Rect x="140" y="55" width="90" height="12" fill="#27272A" rx="2" />
      <Rect x="140" y="75" width="70" height="12" fill="#27272A" rx="2" />
      <Rect x="140" y="95" width="80" height="12" fill="#064E3B" stroke="#10B981" strokeWidth="1" rx="2" />
      <Rect x="150" y="20" width="60" height="22" fill="#064E3B" stroke="#10B981" strokeWidth="1" rx="11" />
      <Line x1="165" y1="28" x2="195" y2="28" stroke="#34D399" strokeWidth="1" />
    </Svg>
  );
}

function ScheduleIllustration() {
  return (
    <Svg width={width - 80} height={180} viewBox="0 0 280 180">
      {[0, 1, 2, 3, 4, 5, 6].map((day) => (
        <Rect
          key={day}
          x={20 + day * 34}
          y={day === 0 || day === 2 || day === 4 ? 50 : 70}
          width={28}
          height={day === 0 || day === 2 || day === 4 ? 80 : 40}
          fill={day === 0 || day === 2 || day === 4 ? '#064E3B' : '#18181B'}
          stroke={day === 0 || day === 2 || day === 4 ? '#10B981' : '#3F3F46'}
          strokeWidth="1"
          rx="4"
        />
      ))}
      <Line x1="20" y1="140" x2="260" y2="140" stroke="#27272A" strokeWidth="1" />
    </Svg>
  );
}

function ImportIllustration() {
  return (
    <Svg width={width - 80} height={180} viewBox="0 0 280 180">
      <Rect x="30" y="40" width="90" height="100" fill="#18181B" stroke="#3F3F46" strokeWidth="1" rx="6" />
      <Line x1="42" y1="60" x2="108" y2="60" stroke="#71717A" strokeWidth="1" />
      <Path d="M130 90 L160 90 L160 80 L180 95 L160 110 L160 100 L130 100 Z" fill="#10B981" />
      <Rect x="190" y="50" width="60" height="80" fill="#18181B" stroke="#10B981" strokeWidth="1.5" rx="6" />
    </Svg>
  );
}

function StartIllustration() {
  return (
    <Svg width={width - 80} height={180} viewBox="0 0 280 180">
      <Circle cx="140" cy="90" r="50" fill="none" stroke="#10B981" strokeWidth="1.5" />
      <Circle cx="140" cy="90" r="6" fill="#10B981" />
    </Svg>
  );
}

function SlideIllustration({ kind }: { kind: SlideKind }) {
  switch (kind) {
    case 'intro':
      return <IntroIllustration />;
    case 'atlas':
      return <AtlasIllustration />;
    case 'schedule':
      return <ScheduleIllustration />;
    case 'import':
      return <ImportIllustration />;
    case 'start':
      return <StartIllustration />;
    default:
      return null;
  }
}

export function OnboardingScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);
  const trackingMode = useSettingsStore((s) => s.trackingMode);
  const setTrackingMode = useSettingsStore((s) => s.setTrackingMode);
  const loadWorkoutForWeekday = useWorkoutStore((s) => s.loadWorkoutForWeekday);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) {
      setIndex(viewableItems[0].index);
    }
  }).current;

  const finish = (useDemo: boolean) => {
    completeOnboarding();
    if (useDemo) {
      loadWorkoutForWeekday(getMondayFirstWeekday());
    }
    router.replace('/(tabs)');
  };

  const currentSlide = slides[index];
  const isLast = index === slides.length - 1;
  const isTrackingSlide = currentSlide?.kind === 'tracking';

  return (
    <AppScreen padded={false}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={{ width }} className="px-8 pt-12 justify-center">
            <View className="items-center mb-6">
              <SlideIllustration kind={item.kind} />
            </View>
            <AppText variant="title" className="mb-3 text-center">
              {item.title}
            </AppText>
            <AppText variant="body" muted className="text-center mb-4">
              {item.subtitle}
            </AppText>
            {item.kind === 'tracking' ? (
              <TrackingModePicker
                value={trackingMode}
                onChange={(mode: TrackingMode) => setTrackingMode(mode)}
              />
            ) : null}
          </View>
        )}
      />

      <View className="px-8 pb-10">
        <View className="flex-row justify-center gap-2 mb-6">
          {slides.map((slide, i) => (
            <View
              key={slide.id}
              className={`h-1.5 rounded-full ${i === index ? 'w-6 bg-emerald-500' : 'w-2 bg-zinc-700'}`}
            />
          ))}
        </View>

        {isLast ? (
          <View className="gap-2">
            <AppButton label="Использовать демо" onPress={() => finish(true)} />
            <AppButton
              label="Перейти к импорту"
              variant="secondary"
              onPress={() => {
                finish(false);
                router.push('/(tabs)/import');
              }}
            />
            <AppButton label="Начать пустым" variant="ghost" onPress={() => finish(false)} />
          </View>
        ) : (
          <AppButton
            label={isTrackingSlide ? 'Выбрал — далее' : 'Далее'}
            onPress={() => listRef.current?.scrollToIndex({ index: index + 1, animated: true })}
          />
        )}
      </View>
    </AppScreen>
  );
}

function getMondayFirstWeekday(date = new Date()): number {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}