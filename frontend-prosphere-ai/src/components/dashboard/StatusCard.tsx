import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { STATUS_LIST } from '@/data/dashboardData';
import { StatusItem } from '@/types/dashboard';

interface StatusCardProps {
  items?: StatusItem[];
  overallProgress?: number;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  items = STATUS_LIST,
  overallProgress = 96,
}) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-space-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
          Status
        </h2>
        <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
          <Icon name="vital_signs" size={16} className="animate-pulse" />
        </div>
      </div>

      {/* Status Rows */}
      <div className="flex flex-col gap-space-sm my-space-md">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest/50 hover:bg-surface-container transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${item.color} ${
                  item.glow || ''
                }`}
              />
              <span className="font-label-md text-label-md text-on-surface font-medium">
                {item.label}
              </span>
            </div>
            <span className="font-label-lg text-label-lg text-on-surface font-bold tabular-nums">
              {item.count}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Progress Section */}
      <div className="pt-space-xs mt-space-xs flex flex-col">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Overall Progress
          </span>
          <span className="font-label-lg text-label-lg text-primary font-bold tabular-nums">
            {overallProgress}%
          </span>
        </div>

        {/* Progress Track & Fill */}
        <div className="w-full h-2.5 bg-surface-container-lowest rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full shadow-[0_0_10px_rgba(132,204,22,0.45)] transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
