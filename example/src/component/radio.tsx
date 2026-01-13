import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface RadioType {
  pick: [any, (val: any) => void];
  array: string[];
  title?: string;
}

export const Radio = (props: RadioType) => {
  const [picked, setPicked] = props.pick;
  const { array, title } = props;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.optionsContainer}>
        {array.map((item) => {
          const isSelected = item === picked;
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => setPicked(item)}
            >
              <View
                style={[
                  styles.radioCircle,
                  isSelected && styles.radioCircleSelected,
                ]}
              >
                {isSelected && <View style={styles.innerCircle} />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  innerCircle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
