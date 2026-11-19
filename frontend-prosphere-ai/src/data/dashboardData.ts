import {
  NavGroup,
  QuickActionItem,
  KpiMetric,
  ChartDayData,
  AnalyticsSummary,
  StatusItem,
  OrderStatItem,
} from '@/types/dashboard';

export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
      { id: 'devices', label: 'Devices', icon: 'smartphone', path: '/devices' },
      { id: 'chat-history', label: 'Chat History', icon: 'chat', path: '/chat-history', badge: '99+' },
      { id: 'crm', label: 'CRM', icon: 'bar_chart', path: '/crm' },
      { id: 'bookings', label: 'Bookings', icon: 'calendar_today', path: '/bookings' },
      { id: 'scheduled-jobs', label: 'Scheduled Jobs', icon: 'schedule', path: '/scheduled-jobs' },
    ],
  },
  {
    title: 'MESSAGING',
    items: [
      { id: 'single-message', label: 'Single Message', icon: 'mail', path: '/single-message' },
      { id: 'bulk-messages', label: 'Bulk Messages', icon: 'send', path: '/bulk-messages' },
      { id: 'templates', label: 'Templates', icon: 'dashboard_customize', path: '/templates' },
    ],
  },
  {
    title: 'CONTACTS',
    items: [
      { id: 'contacts', label: 'Contacts', icon: 'contacts', path: '/contacts' },
      { id: 'groups', label: 'Groups', icon: 'group', path: '/groups' },
    ],
  },
  {
    title: 'AI AUTOMATION',
    items: [
      { id: 'ai-settings', label: 'AI Settings', icon: 'memory', path: '/ai-settings' },
      { id: 'chatbot-flows', label: 'Chatbot Flows', icon: 'account_tree', path: '/chatbot-flows' },
      { id: 'ai-sales-agent', label: 'AI Sales Agent', icon: 'auto_awesome', path: '/ai-sales-agent' },
    ],
  },
];

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'send',
    label: 'Send Message',
    icon: 'send',
    borderColor: 'border-secondary/30',
    textColor: 'text-secondary',
    hoverBg: 'hover:bg-secondary/10',
  },
  {
    id: 'bulk',
    label: 'Bulk Message',
    icon: 'forward_to_inbox',
    borderColor: 'border-outline-variant',
    textColor: 'text-tertiary-fixed',
    hoverBg: 'hover:bg-surface-container-high',
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: 'layers',
    borderColor: 'border-outline-variant',
    textColor: 'text-primary-fixed-dim',
    hoverBg: 'hover:bg-surface-container-high',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: 'person_search',
    borderColor: 'border-outline-variant',
    textColor: 'text-tertiary',
    hoverBg: 'hover:bg-surface-container-high',
  },
  {
    id: 'chat-history',
    label: 'Chat History',
    icon: 'forum',
    borderColor: 'border-outline-variant',
    textColor: 'text-secondary-fixed-dim',
    hoverBg: 'hover:bg-surface-container-high',
  },
];

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'total-messages',
    title: 'Total Messages',
    value: '0',
    icon: 'forum',
    iconVariant: 'primary',
    badge: { label: '+0%', variant: 'pulse' },
    accentColor: 'primary',
  },
  {
    id: 'success-rate',
    title: 'Success Rate',
    value: '100%',
    icon: 'check_circle',
    iconVariant: 'secondary',
    badge: { label: 'Active', variant: 'active' },
    accentColor: 'secondary',
  },
  {
    id: 'total-orders',
    title: 'Total Orders',
    value: '0',
    icon: 'shopping_cart',
    iconVariant: 'primary',
    badge: { label: 'Orders', variant: 'plain' },
    accentColor: 'primary',
  },
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    value: 'Rs0',
    icon: 'payments',
    iconVariant: 'secondary',
    badge: { label: 'Paid', variant: 'paid' },
    accentColor: 'secondary',
  },
  {
    id: 'bookings',
    title: 'Bookings',
    value: '0',
    icon: 'calendar_month',
    iconVariant: 'tertiary',
    badge: { label: '#00', variant: 'mono' },
    accentColor: 'tertiary',
  },
];

export const WEEKLY_CHART_DATA: ChartDayData[] = [
  { day: 'Thu', value: 0, percentage: 5 },
  { day: 'Fri', value: 0, percentage: 5 },
  { day: 'Sat', value: 0, percentage: 5 },
  { day: 'Sun', value: 0, percentage: 5 },
  { day: 'Mon', value: 0, percentage: 5 },
  { day: 'Tue', value: 0, percentage: 5 },
  { day: 'Wed', value: 0, percentage: 5 },
];

export const ANALYTICS_SUMMARY: AnalyticsSummary = {
  sentRate: '0%',
  failedRate: '0%',
  deliveredCount: 0,
  failedCount: 0,
  pendingCount: 0,
};

export const STATUS_LIST: StatusItem[] = [
  {
    label: 'Sent',
    count: 0,
    color: 'bg-secondary',
    glow: 'shadow-[0_0_8px_rgba(74,225,118,0.7)]',
  },
  {
    label: 'Failed',
    count: 0,
    color: 'bg-error',
    glow: 'shadow-[0_0_8px_rgba(255,180,171,0.5)]',
  },
  {
    label: 'Pending',
    count: 0,
    color: 'bg-tertiary-container',
  },
];

export const ORDER_STATISTICS: OrderStatItem[] = [
  {
    id: 'orders',
    title: 'Total Orders',
    value: '0',
    icon: 'shopping_cart',
    iconColor: 'primary',
    hasChevron: true,
  },
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: 'Rs0.00',
    icon: 'attach_money',
    iconColor: 'secondary',
    badge: { label: 'Paid', variant: 'paid' },
  },
  {
    id: 'avg-order',
    title: 'Avg Order',
    value: 'Rs0.00',
    icon: 'trending_up',
    iconColor: 'primary',
    hasChevron: true,
  },
  {
    id: 'pending',
    title: 'Pending Orders',
    value: '0',
    icon: 'pending_actions',
    iconColor: 'tertiary',
    hasTrendIcon: true,
  },
];
