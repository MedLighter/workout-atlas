import { View } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { AppText } from './AppText';
import { AppButton } from './AppButton';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Отмена',
  destructive,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <BottomSheet visible={visible} onClose={onCancel}>
      <AppText variant="h3" className="mb-2">
        {title}
      </AppText>
      {description ? (
        <AppText variant="bodyM" muted className="mb-6">
          {description}
        </AppText>
      ) : null}
      <AppButton
        label={confirmLabel}
        variant={destructive ? 'danger' : 'primary'}
        onPress={onConfirm}
        className="mb-3"
      />
      <AppButton label={cancelLabel} variant="secondary" onPress={onCancel} />
    </BottomSheet>
  );
}