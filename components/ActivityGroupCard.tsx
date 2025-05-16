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
import { ActivityGroup } from '@/types/activities';
import { ActivityCard } from './ActivityCard';

interface ActivityGroupCardProps {
  group: ActivityGroup;
}

export function ActivityGroupCard({ group }: ActivityGroupCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const heightAnim = React.useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: expanded ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: expanded ? 0 : 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
    
    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: colors.cardBackground }]}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            {group.title}
          </Text>
          {group.description && (
            <Text style={[styles.description, { color: colors.tabIconDefault }]}>
              {group.description}
            </Text>
          )}
        </View>
        <View style={styles.rightContent}>
          <Text style={[styles.impact, { color: colors.success }]}>
            {group.impact} kg CO₂
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            {expanded ? (
              <ChevronUp size={18} color={colors.tabIconDefault} />
            ) : (
              <ChevronDown size={18} color={colors.tabIconDefault} />
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <Animated.View style={styles.activitiesContainer}>
          {group.activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    width: 300,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impact: {
    marginRight: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  activitiesContainer: {
    padding: 8,
  },
});