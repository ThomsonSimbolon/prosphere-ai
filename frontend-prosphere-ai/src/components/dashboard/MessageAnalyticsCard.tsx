'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { WEEKLY_CHART_DATA, ANALYTICS_SUMMARY } from '@/data/dashboardData';
import { ChartDayData, AnalyticsSummary } from '@/types/dashboard';

interface MessageAnalyticsCardProps {
  data?: ChartDayData[];
  summary?: AnalyticsSummary;
}

export const MessageAnalyticsCard: React.FC<MessageAnalyticsCardProps> = ({
  data = WEEKLY_CHART_DATA,
  summary = ANALYTICS_SUMMARY,
}) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-2">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Message Analytics
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Campaign performance overview over the current cycle
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(132,204,22,0.8)]" />
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Sent ({summary.sentRate})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-error" />
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Failed ({summary.failedRate})
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Bar Chart Container */}
      <div className="h-56 flex items-end justify-between px-space-md pt-space-lg pb-space-sm gap-3 sm:gap-6 bg-surface-container-lowest/60 rounded-xl my-space-md relative overflow-hidden">
        {/* Subtle Grid Guidelines */}
        <div className="absolute inset-x-0 top-1/4 h-px bg-surface-container-highest/30 pointer-events-none" />
        <div className="absolute inset-x-0 top-2/4 h-px bg-surface-container-highest/30 pointer-events-none" />
        <div className="absolute inset-x-0 top-3/4 h-px bg-surface-container-highest/30 pointer-events-none" />

        {/* Bar Columns */}
        {data.map((item) => (
          <div
            key={item.day}
            className="flex-1 flex flex-col items-center h-full justify-end z-10 group cursor-pointer"
          >
            <span className="font-label-sm text-label-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums font-bold">
              {item.value}
            </span>
            <div className="w-full max-w-[36px] bg-surface-container-high rounded-t-lg h-full flex items-end p-1 transition-all group-hover:bg-surface-variant">
              <div
                className="w-full bg-gradient-to-t from-primary-container to-primary rounded-t-md shadow-[0_0_14px_rgba(132,204,22,0.35)] transition-all duration-500"
                style={{ height: `${item.percentage}%` }}
              />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium group-hover:text-on-surface">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      {/* 3 Summary Columns */}
      <div className="grid grid-cols-3 pt-space-md text-center bg-surface-container/40 rounded-xl py-space-sm">
        {/* Delivered */}
        <div className="flex flex-col items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Delivered
          </span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight tabular-nums mt-0.5">
            {summary.deliveredCount}
          </span>
          <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-0.5 mt-0.5">
            <Icon name="arrow_upward" size={14} />
            {summary.sentRate}
          </span>
        </div>

        {/* Failed */}
        <div className="flex flex-col items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Failed
          </span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight tabular-nums mt-0.5">
            {summary.failedCount}
          </span>
          <span className="font-label-sm text-label-sm text-error font-semibold flex items-center gap-0.5 mt-0.5">
            <Icon name="arrow_downward" size={14} />
            {summary.failedRate}
          </span>
        </div>

        {/* Pending */}
        <div className="flex flex-col items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Pending
          </span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight tabular-nums mt-0.5">
            {summary.pendingCount}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant/60 font-medium mt-0.5">
            0.0%
          </span>
        </div>
      </div>
    </div>
  );
};
