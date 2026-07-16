import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../shared/ui/SafeScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { RadioCard } from '../../../shared/ui/RadioCard';
import { TextField } from '../../../shared/ui/TextField';
import { AppCard } from '../../../shared/ui/AppCard';
import { ProgressDots } from '../../../shared/ui/animations/ProgressDots';
import { FadeSlideIn } from '../../../shared/ui/animations/FadeSlideIn';
import { useOnboardingStore } from '../../onboarding/model/onboarding.store';
import { useWorkoutStore } from '../../workout/model/workout.store';
import { generateProgramFromAnswers } from '../model/generator.logic';

const STEPS = 6;

export function GeneratorWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const frequency = useOnboardingStore((s) => s.frequency);
  const duration = useOnboardingStore((s) => s.duration);
  const location = useOnboardingStore((s) => s.location);
  const experience = useOnboardingStore((s) => s.experience);
  const limitations = useOnboardingStore((s) => s.limitations);
  const limitationNote = useOnboardingStore((s) => s.limitationNote);
  const setFrequency = useOnboardingStore((s) => s.setFrequency);
  const setDuration = useOnboardingStore((s) => s.setDuration);
  const setLocation = useOnboardingStore((s) => s.setLocation);
  const setExperience = useOnboardingStore((s) => s.setExperience);
  const toggleLimitation = useOnboardingStore((s) => s.toggleLimitation);
  const setLimitationNote = useOnboardingStore((s) => s.setLimitationNote);

  const importWeeklyProgram = useWorkoutStore((s) => s.importWeeklyProgram);

  const saveProgram = () => {
    const { templates, program } = generateProgramFromAnswers({
      frequency,
      duration,
      location,
      experience,
      limitations,
    });
    importWeeklyProgram(templates, program);
    router.replace('/(tabs)');
  };

  return (
    <SafeScreen scrollable className="pb-6">
      <View className="mb-6 pt-2">
        <ProgressDots count={STEPS + 1} activeIndex={step} />
      </View>

      <FadeSlideIn key={step} direction="right">
        {step === 0 ? (
          <StepFrequency value={frequency} onChange={setFrequency} onNext={() => setStep(1)} />
        ) : null}
        {step === 1 ? (
          <StepDuration value={duration} onChange={setDuration} onBack={() => setStep(0)} onNext={() => setStep(2)} />
        ) : null}
        {step === 2 ? (
          <StepLocation value={location} onChange={setLocation} onBack={() => setStep(1)} onNext={() => setStep(3)} />
        ) : null}
        {step === 3 ? (
          <StepExperience value={experience} onChange={setExperience} onBack={() => setStep(2)} onNext={() => setStep(4)} />
        ) : null}
        {step === 4 ? (
          <StepLimitations
            limitations={limitations}
            note={limitationNote}
            onToggle={toggleLimitation}
            onNote={setLimitationNote}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
          />
        ) : null}
        {step === 5 ? (
          <StepStrategy frequency={frequency} duration={duration} onBack={() => setStep(4)} onNext={() => setStep(6)} />
        ) : null}
        {step === 6 ? (
          <StepReady onBack={() => setStep(5)} onSave={saveProgram} />
        ) : null}
      </FadeSlideIn>
    </SafeScreen>
  );
}

function StepFrequency({ value, onChange, onNext }: { value: number; onChange: (v: 2 | 3 | 4 | 5) => void; onNext: () => void }) {
  return (
    <View>
      <AppText variant="h1" className="mb-2">Сколько раз в неделю ты реально готов тренироваться?</AppText>
      <AppText variant="bodyM" muted className="mb-6">Лучше стабильные 3 тренировки, чем план на 5, который сложно соблюдать.</AppText>
      {([2, 3, 4, 5] as const).map((n) => (
        <RadioCard key={n} label={`${n} раза`} selected={value === n} onPress={() => onChange(n)} />
      ))}
      <AppButton label="Далее" onPress={onNext} className="mt-4" />
    </View>
  );
}

function StepDuration({ value, onChange, onBack, onNext }: { value: number; onChange: (v: 30 | 45 | 60 | 90) => void; onBack: () => void; onNext: () => void }) {
  return (
    <View>
      <AppText variant="h1" className="mb-6">Сколько времени есть на одну тренировку?</AppText>
      {([30, 45, 60, 90] as const).map((n) => (
        <RadioCard key={n} label={`${n} минут`} selected={value === n} onPress={() => onChange(n)} />
      ))}
      <View className="flex-row gap-3 mt-4">
        <AppButton label="Назад" variant="ghost" onPress={onBack} className="flex-1" />
        <AppButton label="Далее" onPress={onNext} className="flex-[2]" />
      </View>
    </View>
  );
}

function StepLocation({ value, onChange, onBack, onNext }: { value: string; onChange: (v: 'gym' | 'home_dumbbells' | 'home_bodyweight' | 'custom') => void; onBack: () => void; onNext: () => void }) {
  const options = [
    { id: 'gym' as const, label: 'В тренажёрном зале' },
    { id: 'home_dumbbells' as const, label: 'Дома с гантелями' },
    { id: 'home_bodyweight' as const, label: 'Дома без оборудования' },
    { id: 'custom' as const, label: 'Свой набор оборудования' },
  ];
  return (
    <View>
      <AppText variant="h1" className="mb-6">Где ты будешь тренироваться?</AppText>
      {options.map((o) => (
        <RadioCard key={o.id} label={o.label} selected={value === o.id} onPress={() => onChange(o.id)} />
      ))}
      <View className="flex-row gap-3 mt-4">
        <AppButton label="Назад" variant="ghost" onPress={onBack} className="flex-1" />
        <AppButton label="Далее" onPress={onNext} className="flex-[2]" />
      </View>
    </View>
  );
}

function StepExperience({ value, onChange, onBack, onNext }: { value: string; onChange: (v: 'beginner' | 'under_year' | 'one_to_three' | 'over_three') => void; onBack: () => void; onNext: () => void }) {
  const options = [
    { id: 'beginner' as const, label: 'Только начинаю' },
    { id: 'under_year' as const, label: 'До года' },
    { id: 'one_to_three' as const, label: '1–3 года' },
    { id: 'over_three' as const, label: 'Более 3 лет' },
  ];
  return (
    <View>
      <AppText variant="h1" className="mb-6">Как давно ты тренируешься?</AppText>
      {options.map((o) => (
        <RadioCard key={o.id} label={o.label} selected={value === o.id} onPress={() => onChange(o.id)} />
      ))}
      <View className="flex-row gap-3 mt-4">
        <AppButton label="Назад" variant="ghost" onPress={onBack} className="flex-1" />
        <AppButton label="Далее" onPress={onNext} className="flex-[2]" />
      </View>
    </View>
  );
}

function StepLimitations({ limitations, note, onToggle, onNote, onBack, onNext }: {
  limitations: string[];
  note: string;
  onToggle: (item: string) => void;
  onNote: (note: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const items = ['плечи', 'локти', 'запястья', 'спина', 'колени', 'голеностоп'];
  return (
    <View>
      <AppText variant="h1" className="mb-2">Есть ли движения, которые нельзя выполнять?</AppText>
      <AppText variant="bodyM" muted className="mb-6">Мы только исключим неподходящие упражнения.</AppText>
      <View className="gap-2">
        <RadioCard
          icon="shield-checkmark-outline"
          label="Ограничений нет"
          selected={limitations.length === 0}
          onPress={() => limitations.slice().forEach(onToggle)}
        />
        {items.map((item) => (
          <RadioCard
            key={item}
            mode="checkbox"
            label={item.charAt(0).toUpperCase() + item.slice(1)}
            selected={limitations.includes(item)}
            onPress={() => onToggle(item)}
          />
        ))}
      </View>
      <TextField
        label="Заметка"
        placeholder="Болит плечо при жиме над головой"
        value={note}
        onChangeText={onNote}
        className="mt-2 mb-4"
      />
      <View className="flex-row gap-3">
        <AppButton label="Назад" variant="ghost" onPress={onBack} className="flex-1" />
        <AppButton label="Далее" onPress={onNext} className="flex-[2]" />
      </View>
    </View>
  );
}

function StepStrategy({ frequency, duration, onBack, onNext }: { frequency: number; duration: number; onBack: () => void; onNext: () => void }) {
  return (
    <View>
      <AppText variant="h1" className="mb-4">Предлагаем такой формат</AppText>
      <AppCard elevated className="mb-4">
        <AppText variant="h3">Full Body</AppText>
        <AppText variant="bodyM" muted>{frequency} тренировки в неделю</AppText>
        <AppText variant="bodyM" muted>{duration}–{duration + 15} минут</AppText>
        <AppText variant="bodyM" className="mt-3">Пн — Full Body A</AppText>
        <AppText variant="bodyM">Ср — Full Body B</AppText>
        <AppText variant="bodyM">Пт — Full Body C</AppText>
      </AppCard>
      <AppCard className="mb-6">
        <AppText variant="bodyM" className="text-content-secondary">
          Почему так? Три тренировки проще соблюдать, а каждая мышечная группа получает нагрузку несколько раз в неделю.
        </AppText>
      </AppCard>
      <View className="flex-row gap-3">
        <AppButton label="Изменить ответы" variant="ghost" onPress={onBack} className="flex-1" />
        <AppButton label="Посмотреть программу" onPress={onNext} className="flex-[2]" />
      </View>
    </View>
  );
}

function StepReady({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <View>
      <AppText variant="h1" className="mb-2">Твоя первая программа</AppText>
      <AppText variant="bodyM" muted className="mb-6">Full Body · 3 раза в неделю · Около 50 минут</AppText>
      {['Full Body A', 'Full Body B', 'Full Body C'].map((title, index) => (
        <AppCard key={title} className="mb-3" enterIndex={index}>
          <AppText variant="bodyL">{title}</AppText>
          <AppText variant="caption" muted>5 упражнений · 16 подходов</AppText>
        </AppCard>
      ))}
      <AppButton label="Сохранить программу" onPress={onSave} className="mt-4 mb-3" />
      <AppButton label="Создать другой вариант" variant="ghost" onPress={onBack} />
    </View>
  );
}