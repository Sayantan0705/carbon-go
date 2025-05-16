export interface ActivityType {
  id: string;
  name: string;
  category: string;
  impact: number;
  date: Date;
  notes?: string;
}

export interface ActivityGroup {
  id: string;
  title: string;
  impact: number;
  activities: ActivityType[];
  description?: string;
}

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  impact: number;
  count: number;
}