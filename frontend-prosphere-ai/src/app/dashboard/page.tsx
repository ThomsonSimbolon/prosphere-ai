'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  PageHeader,
  KpiMetricsGrid,
  MessageAnalyticsCard,
  SubMetricsGrid,
  BookingActivityBanner,
  StatusCard,
  OrderStatisticsCard,
} from '@/components/dashboard';
import { api } from '@/lib/api';
import { KPI_METRICS, WEEKLY_CHART_DATA, ANALYTICS_SUMMARY, STATUS_LIST, ORDER_STATISTICS } from '@/data/dashboardData';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(KPI_METRICS);
  const [chartData, setChartData] = useState(WEEKLY_CHART_DATA);
  const [summary, setSummary] = useState(ANALYTICS_SUMMARY);
  const [statusList, setStatusList] = useState(STATUS_LIST);
  const [orderStats, setOrderStats] = useState(ORDER_STATISTICS);
  const [subMetrics, setSubMetrics] = useState({
    avgOrder: 'Rs0',
    deliveredCount: 0,
    devicesCount: 1,
    onlineDevicesCount: 1,
  });

  const loadData = async () => {
    const data = await api.getDashboardTelemetry();
    if (data) {
      if (data.kpiMetrics) setMetrics(data.kpiMetrics);
      if (data.weeklyChart) setChartData(data.weeklyChart);
      if (data.analyticsSummary) setSummary(data.analyticsSummary);
      if (data.statusList) setStatusList(data.statusList);
      if (data.orderStatistics) setOrderStats(data.orderStatistics);
      if (data.subMetrics) setSubMetrics(data.subMetrics);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardShell>
      {/* Page Header with working Refresh calling live backend API */}
      <PageHeader onRefresh={loadData} />

      {/* Row 1: 5 Equal-Width KPI Stat Cards */}
      <KpiMetricsGrid metrics={metrics} />

      {/* Row 2 & 3: Asymmetric Main Grid (~66% / ~34%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (8 cols ~ 66%) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {/* Main Card: Message Analytics with 7-Day Chart & 3-Col Summary */}
          <MessageAnalyticsCard data={chartData} summary={summary} />

          {/* 2-Column Sub-Card Split (Avg Order & Devices) */}
          <SubMetricsGrid
            avgOrderValue={subMetrics.avgOrder}
            deliveredCount={subMetrics.deliveredCount}
            devicesCount={subMetrics.devicesCount}
            onlineDevicesCount={subMetrics.onlineDevicesCount}
          />

          {/* Bottom Section Bar: Booking Activity Banner */}
          <BookingActivityBanner />
        </div>

        {/* Right Column (4 cols ~ 34%) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Top Card: Status Breakdown & Overall Progress Bar */}
          <StatusCard items={statusList} />

          {/* Bottom Card: Order Statistics Stacked List */}
          <OrderStatisticsCard items={orderStats} />
        </div>
      </div>
    </DashboardShell>
  );
}
