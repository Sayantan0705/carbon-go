import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { GradientBackground } from '@/components/GradientBackground';
import Colors from '@/constants/Colors';

export default function InsightsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { quickActions, recentActivities, totalCarbonSaved } = useAppContext();
  const [timeFrame, setTimeFrame] = useState('week'); // 'day', 'week', 'month', 'year'

  // Simple analytics based on the data
  const totalActivities = recentActivities.length;
  
  // Category distribution
  const categoryData = quickActions.map(action => {
    const activitiesInCategory = recentActivities.filter(a => a.category === action.id);
    const categoryTotal = activitiesInCategory.reduce((sum, a) => sum + a.impact, 0);
    const percentage = totalCarbonSaved > 0 
      ? Math.round((categoryTotal / totalCarbonSaved) * 100) 
      : 0;
      
    return {
      id: action.id,
      label: action.label,
      icon: action.icon,
      total: categoryTotal,
      count: activitiesInCategory.length,
      percentage,
    };
  }).sort((a, b) => b.total - a.total);

  // Weekly trend (simplified for this example)
  const weeklyReducedCO2 = 5.2;
  const weeklyChange = 12; // percentage improvement from last week
  
  // Times of day
  const dayParts = [
    { label: 'Morning', value: 35 },
    { label: 'Afternoon', value: 42 },
    { label: 'Evening', value: 23 },
  ];

  return (
    <GradientBackground>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carbon Insights</Text>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Time frame selector */}
        <View style={styles.timeFrameContainer}>
          {['day', 'week', 'month', 'year'].map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.timeFrameButton,
                timeFrame === period && { 
                  backgroundColor: colors.tint,
                  borderColor: colors.tint, 
                },
              ]}
              onPress={() => setTimeFrame(period)}
            >
              <Text
                style={[
                  styles.timeFrameText,
                  timeFrame === period && { color: '#FFFFFF' },
                  { color: timeFrame === period ? '#FFFFFF' : colors.text },
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Summary card */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {totalCarbonSaved.toFixed(1)}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
                Total CO₂ (kg)
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {totalActivities}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
                Activities
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {weeklyReducedCO2.toFixed(1)}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
                Weekly Avg
              </Text>
            </View>
          </View>
        </View>
        
        {/* Weekly trend */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly Trend</Text>
          <View style={styles.trendContainer}>
            <View style={styles.trendGraph}>
              {/* Simple placeholder bar chart */}
              <View style={styles.graphBars}>
                {[30, 45, 28, 60, 35, 25, 40].map((height, index) => (
                  <View 
                    key={`bar-${index}`}
                    style={[
                      styles.bar, 
                      { 
                        height: height, 
                        backgroundColor: colors.tint,
                      },
                    ]} 
                  />
                ))}
              </View>
              <View style={styles.graphLabels}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <Text 
                    key={`day-${index}`}
                    style={[styles.dayLabel, { color: colors.tabIconDefault }]}
                  >
                    {day}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.trendInfo}>
              <Text style={[styles.trendPercentage, { color: colors.success }]}>
                ↓ {weeklyChange}%
              </Text>
              <Text style={[styles.trendDescription, { color: colors.tabIconDefault }]}>
                from last week
              </Text>
            </View>
          </View>
        </View>
        
        {/* Category distribution */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Impact by Category</Text>
          {categoryData.map(category => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[styles.categoryLabel, { color: colors.text }]}>
                    {category.label}
                  </Text>
                </View>
                <Text style={[styles.categoryPercentage, { color: colors.text }]}>
                  {category.percentage}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { 
                      width: `${category.percentage}%`,
                      backgroundColor: colors.tint,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.categoryDetails, { color: colors.tabIconDefault }]}>
                {category.total.toFixed(1)} kg CO₂ from {category.count} activities
              </Text>
            </View>
          ))}
        </View>
        
        {/* Activity timing */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Activity Timing</Text>
          <View style={styles.timingContainer}>
            {dayParts.map(part => (
              <View key={part.label} style={styles.timingItem}>
                <Text style={[styles.timingLabel, { color: colors.text }]}>
                  {part.label}
                </Text>
                <View style={styles.timingBarContainer}>
                  <View 
                    style={[
                      styles.timingBar,
                      { 
                        width: `${part.value}%`,
                        backgroundColor: colors.tint,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.timingPercentage, { color: colors.tabIconDefault }]}>
                  {part.value}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
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
  timeFrameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    padding: 4,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  timeFrameText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendGraph: {
    flex: 3,
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayLabel: {
    width: 20,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  trendInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendPercentage: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  trendDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  categoryPercentage: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  categoryDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  timingContainer: {
    marginTop: 8,
  },
  timingItem: {
    marginBottom: 12,
  },
  timingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  timingBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  timingBar: {
    height: 8,
    borderRadius: 4,
  },
  timingPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
  },
});