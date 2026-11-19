import { prisma } from '../../config/prisma.js';

export class AnalyticsService {
  async getDashboardTelemetry() {
    // 1. Count actual records from database
    const totalMessages = await prisma.message.count();
    const deliveredMessages = await prisma.message.count({ where: { status: 'DELIVERED' } });
    const failedMessages = await prisma.message.count({ where: { status: 'FAILED' } });
    const pendingMessages = await prisma.message.count({ where: { status: 'PENDING' } });
    const totalOrders = await prisma.lead.count({ where: { stage: 'CLOSED_WON' } });
    const totalBookings = await prisma.booking.count();
    const activeSessions = await prisma.deviceSession.count({ where: { status: 'CONNECTED' } });

    // Aggregate revenue
    const revenueAgg = await prisma.lead.aggregate({
      _sum: { value: true },
      where: { stage: 'CLOSED_WON' },
    });
    const totalRevenueValue = Number(revenueAgg._sum.value || 0);

    return {
      kpiMetrics: [
        {
          id: 'total-messages',
          title: 'Total Messages',
          value: String(totalMessages),
          icon: 'forum',
          iconVariant: 'primary',
          badge: { label: '+0%', variant: 'pulse' },
          accentColor: 'primary',
        },
        {
          id: 'success-rate',
          title: 'Success Rate',
          value: totalMessages > 0 ? `${((deliveredMessages / totalMessages) * 100).toFixed(1)}%` : '100%',
          icon: 'check_circle',
          iconVariant: 'secondary',
          badge: { label: 'Active', variant: 'active' },
          accentColor: 'secondary',
        },
        {
          id: 'total-orders',
          title: 'Total Orders',
          value: String(totalOrders),
          icon: 'shopping_cart',
          iconVariant: 'primary',
          badge: { label: 'Orders', variant: 'plain' },
          accentColor: 'primary',
        },
        {
          id: 'total-revenue',
          title: 'Total Revenue',
          value: `Rs${totalRevenueValue.toLocaleString()}`,
          icon: 'payments',
          iconVariant: 'secondary',
          badge: { label: 'Paid', variant: 'paid' },
          accentColor: 'secondary',
        },
        {
          id: 'bookings',
          title: 'Bookings',
          value: String(totalBookings),
          icon: 'calendar_month',
          iconVariant: 'tertiary',
          badge: { label: '#00', variant: 'mono' },
          accentColor: 'tertiary',
        },
      ],
      weeklyChart: [
        { day: 'Thu', value: 0, percentage: 5 },
        { day: 'Fri', value: 0, percentage: 5 },
        { day: 'Sat', value: 0, percentage: 5 },
        { day: 'Sun', value: 0, percentage: 5 },
        { day: 'Mon', value: 0, percentage: 5 },
        { day: 'Tue', value: 0, percentage: 5 },
        { day: 'Wed', value: totalMessages, percentage: totalMessages > 0 ? 50 : 5 },
      ],
      analyticsSummary: {
        sentRate: totalMessages > 0 ? `${((deliveredMessages / totalMessages) * 100).toFixed(1)}%` : '0%',
        failedRate: totalMessages > 0 ? `${((failedMessages / totalMessages) * 100).toFixed(1)}%` : '0%',
        deliveredCount: deliveredMessages,
        failedCount: failedMessages,
        pendingCount: pendingMessages,
      },
      statusList: [
        {
          label: 'Sent',
          count: deliveredMessages,
          color: 'bg-secondary',
          glow: 'shadow-[0_0_8px_rgba(74,225,118,0.7)]',
        },
        {
          label: 'Failed',
          count: failedMessages,
          color: 'bg-error',
          glow: 'shadow-[0_0_8px_rgba(255,180,171,0.5)]',
        },
        {
          label: 'Pending',
          count: pendingMessages,
          color: 'bg-outline',
          glow: 'shadow-none',
        },
      ],
      overallProgress: 100,
      subMetrics: {
        avgOrder: `Rs${totalOrders > 0 ? (totalRevenueValue / totalOrders).toFixed(0) : '0'}`,
        deliveredCount: deliveredMessages,
        devicesCount: activeSessions,
        onlineDevicesCount: activeSessions,
      },
      orderStatistics: [
        {
          id: 'orders',
          title: 'Total Orders',
          value: String(totalOrders),
          icon: 'shopping_cart',
          iconColor: 'primary',
          hasChevron: true,
        },
        {
          id: 'revenue',
          title: 'Total Revenue',
          value: `Rs${totalRevenueValue.toFixed(2)}`,
          icon: 'attach_money',
          iconColor: 'secondary',
          badge: { label: 'Paid', variant: 'paid' },
        },
        {
          id: 'avg-order',
          title: 'Avg Order',
          value: `Rs${totalOrders > 0 ? (totalRevenueValue / totalOrders).toFixed(2) : '0.00'}`,
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
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
