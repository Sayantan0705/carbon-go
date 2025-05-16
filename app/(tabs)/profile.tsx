import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { ChevronRight, Bell, CircleHelp as HelpCircle, Info, Settings as SettingsIcon } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { GradientBackground } from '@/components/GradientBackground';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { totalCarbonSaved } = useAppContext();
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  
  const toggleNotifications = () => setNotifications(!notifications);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <GradientBackground>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.tint }]}>
            <Text style={styles.avatarText}>CG</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>Carbon GO User</Text>
            <Text style={[styles.profileStatus, { color: colors.success }]}>
              🌱 Saved {totalCarbonSaved.toFixed(1)} kg CO₂
            </Text>
          </View>
        </View>
        
        {/* Settings Sections */}
        <View style={styles.sectionTitle}>
          <SettingsIcon size={18} color={colors.tabIconDefault} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitleText, { color: colors.text }]}>
            Settings
          </Text>
        </View>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: colors.tint }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={[styles.settingSeparator, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: colors.tint }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
              ios_backgroundColor="#3e3e3e"
              disabled={Platform.OS === 'web'}
            />
          </View>
          
          <View style={[styles.settingSeparator, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Measurement Units</Text>
            <View style={styles.settingAction}>
              <Text style={[styles.settingValue, { color: colors.tabIconDefault }]}>
                Metric (kg)
              </Text>
              <ChevronRight size={18} color={colors.tabIconDefault} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Help & Support */}
        <View style={styles.sectionTitle}>
          <HelpCircle size={18} color={colors.tabIconDefault} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitleText, { color: colors.text }]}>
            Help & Support
          </Text>
        </View>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Carbon Calculation Method</Text>
            <ChevronRight size={18} color={colors.tabIconDefault} />
          </TouchableOpacity>
          
          <View style={[styles.settingSeparator, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>FAQ</Text>
            <ChevronRight size={18} color={colors.tabIconDefault} />
          </TouchableOpacity>
          
          <View style={[styles.settingSeparator, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Contact Support</Text>
            <ChevronRight size={18} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>
        
        {/* About */}
        <View style={styles.sectionTitle}>
          <Info size={18} color={colors.tabIconDefault} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitleText, { color: colors.text }]}>
            About
          </Text>
        </View>
        
        <View style={[styles.settingsCard, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Policy</Text>
            <ChevronRight size={18} color={colors.tabIconDefault} />
          </TouchableOpacity>
          
          <View style={[styles.settingSeparator, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Terms of Service</Text>
            <ChevronRight size={18} color={colors.tabIconDefault} />
          </TouchableOpacity>
          
          <View style={[styles.settingSeparator, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>App Version</Text>
            <Text style={[styles.settingValue, { color: colors.tabIconDefault }]}>1.0.0</Text>
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
    paddingBottom: 32,
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
  profileCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  settingsCard: {
    borderRadius: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  settingSeparator: {
    height: 1,
    marginHorizontal: 16,
  },
});