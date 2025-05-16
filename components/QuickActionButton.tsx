import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Platform,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  impact: number;
  onPress: () => void;
  tooltip?: string;
  showTooltip?: boolean;
}

export function QuickActionButton({
  icon,
  label,
  impact,
  onPress,
  tooltip,
  showTooltip = false,
}: QuickActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger haptic feedback on non-web platforms
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress();
  };

  return (
    <View style={styles.container}>
      {showTooltip && tooltip && (
        <View style={styles.tooltipContainer}>
          <Text style={styles.tooltipText}>{tooltip}</Text>
        </View>
      )}
      <Animated.View
        style={[
          styles.buttonWrapper,
          { 
            backgroundColor: colors.cardBackground,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.icon}>{icon}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.impact, { color: colors.success }]}>
        {impact} kg CO₂
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    position: 'relative',
  },
  buttonWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  impact: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  tooltipContainer: {
    position: 'absolute',
    top: -40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});