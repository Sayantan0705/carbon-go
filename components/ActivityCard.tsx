import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Animated,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ActivityType } from '@/types/activities';

interface ActivityCardProps {
  activity: ActivityType;
  isExpanded?: boolean;
}

export function ActivityCard({ activity, isExpanded = false }: ActivityCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [expanded, setExpanded] = useState(isExpanded);
  const rotateAnim = React.useRef(new Animated.Value(expanded ? 1 : 0)).current;

  const toggleExpand = () => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const categoryIcon = () => {
    switch (activity.category) {
      case 'transport':
        return '🚗';
      case 'home':
        return '🏠';
      case 'food':
        return '🍔';
      case 'shopping':
        return '🛒';
      default:
        return '📊';
    }
  };

  const formattedDate = activity.date instanceof Date
    ? activity.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : new Date(activity.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          <Text style={styles.icon}>{categoryIcon()}</Text>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {activity.name}
            </Text>
            <Text style={[styles.date, { color: colors.tabIconDefault }]}>
              {formattedDate}
            </Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <Text style={[styles.impact, { color: colors.success }]}>
            {activity.impact} kg CO₂
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            {expanded ? (
              <ChevronUp size={16} color={colors.tabIconDefault} />
            ) : (
              <ChevronDown size={16} color={colors.tabIconDefault} />
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
      
      {expanded && activity.notes && (
        <View style={styles.cardBody}>
          <Text style={[styles.notes, { color: colors.text }]}>
            {activity.notes}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  icon: {
    fontSize: 24,
  },
  impact: {
    marginRight: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  cardBody: {
    padding: 16,
    paddingTop: 0,
  },
  notes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});