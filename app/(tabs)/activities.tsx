import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
} from 'react-native';
import { Filter } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { GradientBackground } from '@/components/GradientBackground';
import { ActivityCard } from '@/components/ActivityCard';
import { ActivityGroupCard } from '@/components/ActivityGroupCard';
import { CreateActivityButton } from '@/components/CreateActivityButton';
import { CreateActivityModal } from '@/components/CreateActivityModal';
import { ActivityType } from '@/types/activities';
import Colors from '@/constants/Colors';

export default function ActivitiesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const {
    activityGroups,
    recentActivities,
    addActivity,
    showTooltips,
    dismissTooltips,
  } = useAppContext();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = [
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'food', label: 'Food', icon: '🍔' },
    { id: 'shopping', label: 'Shopping', icon: '🛒' },
  ];

  const filteredActivities = filterCategory
    ? recentActivities.filter(activity => activity.category === filterCategory)
    : recentActivities;

  const handleAddActivity = (activity: ActivityType) => {
    addActivity(activity);
    if (showTooltips) dismissTooltips();
  };

  const toggleFilter = (categoryId: string) => {
    if (filterCategory === categoryId) {
      setFilterCategory(null);
    } else {
      setFilterCategory(categoryId);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Activities</Text>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Filter buttons */}
        <View style={styles.filterContainer}>
          <Text style={[styles.filterTitle, { color: colors.text }]}>
            <Filter size={16} color={colors.text} style={styles.filterIcon} /> Filter by:
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterButtonsContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: filterCategory === category.id 
                      ? colors.tint 
                      : colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => toggleFilter(category.id)}
              >
                <Text style={styles.filterButtonIcon}>{category.icon}</Text>
                <Text 
                  style={[
                    styles.filterButtonText,
                    { color: filterCategory === category.id ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Frequent Activity Groups */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            My Frequent Activities
          </Text>
          {activityGroups.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activityGroupsContainer}
            >
              {activityGroups.map(group => (
                <ActivityGroupCard key={group.id} group={group} />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.emptyStateCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                No activity groups created yet. Group activities to track them easily!
              </Text>
            </View>
          )}
        </View>
        
        {/* All or Filtered Activities */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {filterCategory 
              ? `${categories.find(c => c.id === filterCategory)?.label} Activities` 
              : 'All Activities'}
          </Text>
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          ) : (
            <View style={[styles.emptyStateCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                {filterCategory 
                  ? `No ${categories.find(c => c.id === filterCategory)?.label.toLowerCase()} activities yet.` 
                  : 'No activities recorded yet. Tap + to add your first activity!'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <CreateActivityButton 
        onPress={() => setModalVisible(true)}
        showTooltip={showTooltips && !modalVisible}
      />
      
      <CreateActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddActivity}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for the floating button
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  activityGroupsContainer: {
    paddingBottom: 8,
    paddingLeft: 4,
  },
  filterContainer: {
    marginTop: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterButtonsContainer: {
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  emptyStateCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});