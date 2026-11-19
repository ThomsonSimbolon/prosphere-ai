'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { TimeFilter } from '@/types/dashboard';

interface PageHeaderProps {
  onRefresh?: () => void;
  onFilterChange?: (filter: TimeFilter) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  onRefresh,
  onFilterChange,
}) => {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filters: TimeFilter[] = ['24h', '7d', '30d', 'All'];

  const handleFilterClick = (filter: TimeFilter) => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
      {/* Title & Badge */}
      <div className="flex flex-col">
        <div className="flex items-center gap-space-xs">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Dashboard
          </h1>
          <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Live Telemetry
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
          Campaign Analytics & Order Insights
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-sm self-start md:self-auto">
        {/* Segmented Time Filter Container */}
        <div className="bg-surface-container-low p-1 rounded-xl flex items-center gap-1 shadow-sm">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterClick(filter)}
                className={`px-3 py-1 rounded font-label-md text-label-md transition-all ${
                  isActive
                    ? 'bg-surface-container-high text-primary font-semibold shadow-[0_0_12px_rgba(132,204,22,0.18)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Refresh Action Button */}
        <button
          type="button"
          onClick={handleRefreshClick}
          className="bg-surface-container-low hover:bg-surface-container px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all active:scale-95 shadow-sm"
        >
          <Icon
            name="autorenew"
            size={16}
            className={`text-primary transition-transform duration-500 ${
              isRefreshing ? 'rotate-180' : ''
            }`}
          />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};
