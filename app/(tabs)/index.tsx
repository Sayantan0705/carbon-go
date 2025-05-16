import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  useColorScheme,
} from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { GradientBackground } from '@/components/GradientBackground';
import { QuickActionButton } from '@/components/QuickActionButton';
import { CarbonStats } from '@/components/CarbonStats';
import { CreateActivityButton } from '@/components/CreateActivityButton';
import { CreateActivityModal } from '@/components/CreateActivityModal';
import { ActivityType } from '@/types/activities';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const {
    quickActions,
    recentActivities,
    totalCarbonSaved,
    addActivity,
    logQuickAction,
    showTooltips,
    dismissTooltips,
  } = useAppContext();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [showedTooltips, setShowedTooltips] = useState(false);

  useEffect(() => {
    if (showTooltips && !showedTooltips) {
      setShowedTooltips(true);
      
      // Auto-dismiss tooltips after 5 seconds
      const timer = setTimeout(() => {
        dismissTooltips();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showTooltips, showedTooltips, dismissTooltips]);

  const handleQuickAction = (actionId: string) => {
    logQuickAction(actionId);
    if (showTooltips) dismissTooltips();
  };

  const handleAddActivity = (activity: ActivityType) => {
    addActivity(activity);
    if (showTooltips) dismissTooltips();
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Carbon GO</Text>
          <Text style={styles.headerSubtitle}>Track your carbon footprint</Text>
        </View>

        <CarbonStats 
          totalSaved={totalCarbonSaved}
          totalActivities={recentActivities.length}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={action.id}
                icon={action.icon}
                label={action.label}
                impact={action.impact}
                onPress={() => handleQuickAction(action.id)}
                tooltip={index === 0 && showTooltips ? "Track activities with one tap" : undefined}
                showTooltip={index === 0 && showTooltips}
              />
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Carbon Impact Tip
          </Text>
          <Text style={[styles.cardText, { color: colors.text }]}>
            Reducing your meat consumption by just one meal per week can save up to 340 kg of CO₂ per year. Try a meat-free Monday!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activities
          </Text>
          {recentActivities.length > 0 ? (
            <View style={[styles.recentActivitiesCard, { backgroundColor: colors.cardBackground }]}>
              {recentActivities.slice(0, 3).map((activity) => (
                <View 
                  key={activity.id} 
                  style={[
                    styles.recentActivityItem,
                    { borderBottomColor: colors.border }
                  ]}
                >
                  <View style={styles.recentActivityInfo}>
                    <Text style={[styles.recentActivityName, { color: colors.text }]}>
                      {activity.name}
                    </Text>
                    <Text style={[styles.recentActivityCategory, { color: colors.tabIconDefault }]}>
                      {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                    </Text>
                  </View>
                  <Text style={[styles.recentActivityImpact, { color: colors.success }]}>
                    {activity.impact} kg CO₂
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyStateCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                No recent activities. Start tracking your carbon footprint!
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
  headerContainer: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 8,
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
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  recentActivitiesCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  recentActivityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  recentActivityInfo: {
    flex: 1,
  },
  recentActivityName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  recentActivityCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  recentActivityImpact: {
    fontSize: 16,
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