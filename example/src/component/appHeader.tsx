import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  avatar?: string;
  onMenuPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  avatar,
  onMenuPress,
}) => {
  return (
    <View style={[styles.container, avatar ? styles.rowContainer : null]}>
      {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <View style={styles.textContainer}>
        <Text style={[styles.title, avatar ? styles.smallTitle : null]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, avatar ? styles.boldSubtitle : null]}>
            {subtitle}
          </Text>
        )}
      </View>
      {onMenuPress && (
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Image
            source={require('../assets/icon/dots.png')}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 0,
    position: 'relative',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: '#F0F0F0',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
  },
  boldSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  menuButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  menuIcon: {
    height: 30,
    width: 40,
  },
});
