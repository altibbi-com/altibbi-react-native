import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  containerStyle?: ViewStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  containerStyle,
}) => {
  let buttonStyle = styles.primaryButton;
  let textStyle = styles.primaryText;

  if (variant === 'secondary') {
    buttonStyle = styles.secondaryButton;
    textStyle = styles.secondaryText;
  } else if (variant === 'danger') {
    buttonStyle = styles.dangerButton;
    textStyle = styles.dangerText;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        containerStyle,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.error || '#FF4d4f',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.white,
  },
});
