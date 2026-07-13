import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { useCopyToClipboard } from '../../../shared/hooks/useCopyToClipboard';
import {
  AI_IMPORT_SECTIONS,
  AI_IMPORT_WORKFLOW_STEPS,
  buildAiImportCopyPackage,
} from '../../import/model/ai-import.prompt';
import type { WorkoutUnit } from '../../workout/model/workout.types';

interface AiImportPromptSectionProps {
  unit: WorkoutUnit;
  variant?: 'full' | 'compact';
}

export function AiImportPromptSection({ unit, variant = 'full' }: AiImportPromptSectionProps) {
  const { copy, isCopied } = useCopyToClipboard();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopyAll = () => copy(buildAiImportCopyPackage(unit), 'all');

  const toggleSection = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  if (variant === 'compact') {
    return (
      <View className="mb-4 p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl">
        <View className="flex-row items-start gap-3 mb-3">
          <View className="w-9 h-9 rounded-full bg-emerald-500/15 items-center justify-center">
            <Ionicons name="sparkles-outline" size={18} color="#34D399" />
          </View>
          <View className="flex-1">
            <AppText variant="section" className="mb-1">
              Сгенерировать через AI
            </AppText>
            <AppText variant="caption" muted>
              Скопируй промпт с примерами, вставь в ChatGPT / Claude и импортируй JSON-ответ сюда.
            </AppText>
          </View>
        </View>
        <AppButton
          label={isCopied('all') ? 'Скопировано!' : 'Скопировать всё для AI'}
          onPress={handleCopyAll}
        />
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="flex-row items-center gap-2 mb-2">
        <Ionicons name="sparkles" size={20} color="#34D399" />
        <AppText variant="section">Импорт через AI</AppText>
      </View>
      <AppText variant="body" muted className="mb-4">
        Workout Import Protocol v1.0 — всё необходимое для генерации тренировки в одном комплекте.
      </AppText>

      <View className="mb-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <AppText variant="caption" muted className="mb-3">
          Как это работает
        </AppText>
        {AI_IMPORT_WORKFLOW_STEPS.map((item) => (
          <View key={item.step} className="flex-row gap-3 mb-3 last:mb-0">
            <View className="w-7 h-7 rounded-full bg-emerald-500/15 items-center justify-center">
              <AppText variant="caption" className="text-emerald-400">
                {item.step}
              </AppText>
            </View>
            <View className="flex-1">
              <AppText variant="row" className="mb-0.5 text-sm">
                {item.title}
              </AppText>
              <AppText variant="caption" muted>
                {item.description}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <AppButton
        className="mb-3"
        label={isCopied('all') ? 'Скопировано в буфер!' : 'Скопировать всё для AI'}
        onPress={handleCopyAll}
      />

      <View className="gap-2">
        {AI_IMPORT_SECTIONS.map((section) => {
          const expanded = expandedId === section.id;
          const preview = section.getContent(unit).slice(0, 120).trim();

          return (
            <View
              key={section.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <Pressable
                onPress={() => toggleSection(section.id)}
                className="flex-row items-center justify-between p-4 active:bg-zinc-800/60"
              >
                <View className="flex-1 pr-3">
                  <AppText variant="row" className="text-sm mb-0.5">
                    {section.title}
                  </AppText>
                  <AppText variant="caption" muted>
                    {section.description}
                  </AppText>
                </View>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#71717A"
                />
              </Pressable>

              {expanded ? (
                <View className="px-4 pb-4 border-t border-zinc-800">
                  <AppText variant="caption" muted className="mt-3 mb-3 leading-5">
                    {section.getContent(unit)}
                  </AppText>
                  <AppButton
                    compact
                    variant="secondary"
                    label={isCopied(section.id) ? 'Скопировано!' : 'Скопировать'}
                    onPress={() => copy(section.getContent(unit), section.id)}
                  />
                </View>
              ) : (
                <View className="px-4 pb-3">
                  <AppText variant="caption" muted numberOfLines={2}>
                    {preview}...
                  </AppText>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}