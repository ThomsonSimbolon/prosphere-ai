export type TimeFilter = '24h' | '7d' | '30d' | 'All';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string;
  active?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
  borderColor?: string;
  textColor?: string;
  hoverBg?: string;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  iconVariant?: 'primary' | 'secondary' | 'tertiary';
  badge: {
    label: string;
    variant: 'pulse' | 'active' | 'plain' | 'paid' | 'mono';
  };
  accentColor: 'primary' | 'secondary' | 'tertiary';
}

export interface ChartDayData {
  day: string;
  value: number;
  percentage: number; // height percentage 0-100
}

export interface AnalyticsSummary {
  sentRate: string;
  failedRate: string;
  deliveredCount: number;
  failedCount: number;
  pendingCount: number;
}

export interface StatusItem {
  label: string;
  count: number;
  color: string;
  glow?: string;
}

export interface OrderStatItem {
  id: string;
  title: string;
  value: string;
  icon: string;
  iconColor: 'primary' | 'secondary' | 'tertiary';
  badge?: {
    label: string;
    variant: 'pulse' | 'active' | 'plain' | 'paid' | 'mono';
  };
  hasChevron?: boolean;
  hasTrendIcon?: boolean;
}
