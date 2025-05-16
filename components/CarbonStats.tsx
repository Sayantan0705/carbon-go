import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface CarbonStatsProps {
  totalSaved: number;
  totalActivities: number;
}

export function CarbonStats({ totalSaved, totalActivities }: CarbonStatsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Calculate approximate equivalents
  const treeEquivalent = (totalSaved / 21).toFixed(1); // Approx CO2 absorbed by one tree in a year
  const carEquivalent = (totalSaved / 4.6).toFixed(1); // Approx CO2 from 1 gallon of gasoline

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.mainStat}>
        <Text style={[styles.totalAmount, { color: colors.text }]}>
          {totalSaved.toFixed(1)}
        </Text>
        <Text style={[styles.unit, { color: colors.text }]}>kg CO₂</Text>
        <Text style={[styles.label, { color: colors.tabIconDefault }]}>
          Carbon Impact Tracked
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {totalActivities}
          </Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>
            Activities
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {treeEquivalent}
          </Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>
            Trees/Year
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {carEquivalent}
          </Text>
          <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>
            Gallons Gas
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
  },
  unit: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
});