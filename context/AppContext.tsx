import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityType, ActivityGroup, QuickAction } from '@/types/activities';

interface AppContextType {
  quickActions: QuickAction[];
  activityGroups: ActivityGroup[];
  recentActivities: ActivityType[];
  totalCarbonSaved: number;
  addActivity: (activity: ActivityType) => void;
  addActivityGroup: (group: ActivityGroup) => void;
  logQuickAction: (actionId: string) => void;
  showTooltips: boolean;
  dismissTooltips: () => void;
}

const defaultContext: AppContextType = {
  quickActions: [],
  activityGroups: [],
  recentActivities: [],
  totalCarbonSaved: 0,
  addActivity: () => {},
  addActivityGroup: () => {},
  logQuickAction: () => {},
  showTooltips: true,
  dismissTooltips: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    { id: 'transport', icon: '🚗', label: 'Transport', impact: 2.3, count: 0 },
    { id: 'home', icon: '🏠', label: 'Home', impact: 1.5, count: 0 },
    { id: 'food', icon: '🍔', label: 'Food', impact: 1.8, count: 0 },
    { id: 'shopping', icon: '🛒', label: 'Shopping', impact: 0.7, count: 0 },
  ]);
  
  const [activityGroups, setActivityGroups] = useState<ActivityGroup[]>([
    {
      id: 'office-day',
      title: 'Office Day',
      impact: 4.2,
      activities: [
        { id: '1', name: 'Bus to work', category: 'transport', impact: 1.2, date: new Date() },
        { id: '2', name: 'Vegetarian lunch', category: 'food', impact: 0.5, date: new Date() },
        { id: '3', name: 'Office heating', category: 'home', impact: 2.5, date: new Date() },
      ],
    },
    {
      id: 'weekend-routine',
      title: 'Weekend Routine',
      impact: 3.8,
      activities: [
        { id: '4', name: 'Grocery shopping', category: 'shopping', impact: 0.7, date: new Date() },
        { id: '5', name: 'Drive to gym', category: 'transport', impact: 1.1, date: new Date() },
        { id: '6', name: 'Cook dinner', category: 'food', impact: 2.0, date: new Date() },
      ],
    },
  ]);
  
  const [recentActivities, setRecentActivities] = useState<ActivityType[]>([]);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
  const [showTooltips, setShowTooltips] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedActions = await AsyncStorage.getItem('quickActions');
      const storedGroups = await AsyncStorage.getItem('activityGroups');
      const storedActivities = await AsyncStorage.getItem('recentActivities');
      const storedCarbon = await AsyncStorage.getItem('totalCarbonSaved');
      const storedTooltips = await AsyncStorage.getItem('showTooltips');
      
      if (storedActions) setQuickActions(JSON.parse(storedActions));
      if (storedGroups) setActivityGroups(JSON.parse(storedGroups));
      if (storedActivities) setRecentActivities(JSON.parse(storedActivities));
      if (storedCarbon) setTotalCarbonSaved(JSON.parse(storedCarbon));
      if (storedTooltips) setShowTooltips(JSON.parse(storedTooltips));
    } catch (error) {
      console.error('Failed to load data from storage', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('quickActions', JSON.stringify(quickActions));
      await AsyncStorage.setItem('activityGroups', JSON.stringify(activityGroups));
      await AsyncStorage.setItem('recentActivities', JSON.stringify(recentActivities));
      await AsyncStorage.setItem('totalCarbonSaved', JSON.stringify(totalCarbonSaved));
      await AsyncStorage.setItem('showTooltips', JSON.stringify(showTooltips));
    } catch (error) {
      console.error('Failed to save data to storage', error);
    }
  };

  useEffect(() => {
    saveData();
  }, [quickActions, activityGroups, recentActivities, totalCarbonSaved, showTooltips]);

  const addActivity = (activity: ActivityType) => {
    setRecentActivities(prev => [activity, ...prev].slice(0, 10));
    setTotalCarbonSaved(prev => prev + activity.impact);
  };

  const addActivityGroup = (group: ActivityGroup) => {
    setActivityGroups(prev => [group, ...prev]);
    const totalImpact = group.activities.reduce((sum, act) => sum + act.impact, 0);
    setTotalCarbonSaved(prev => prev + totalImpact);
  };

  const logQuickAction = (actionId: string) => {
    setQuickActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, count: action.count + 1 } 
          : action
      )
    );
    
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      const newActivity: ActivityType = {
        id: Date.now().toString(),
        name: `Quick ${action.label}`,
        category: actionId,
        impact: action.impact,
        date: new Date(),
      };
      
      addActivity(newActivity);
    }
  };

  const dismissTooltips = () => {
    setShowTooltips(false);
  };

  const contextValue: AppContextType = {
    quickActions,
    activityGroups,
    recentActivities,
    totalCarbonSaved,
    addActivity,
    addActivityGroup,
    logQuickAction,
    showTooltips,
    dismissTooltips,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};