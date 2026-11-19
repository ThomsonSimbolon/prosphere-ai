import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface SubMetricsGridProps {
  avgOrderValue?: string;
  deliveredCount?: number;
  devicesCount?: number;
  onlineDevicesCount?: number;
}

export const SubMetricsGrid: React.FC<SubMetricsGridProps> = ({
  avgOrderValue = 'Rs0',
  deliveredCount = 0,
  devicesCount = 1,
  onlineDevicesCount = 1,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
      {/* Sub-Card Left: Avg Order */}
      <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col justify-between hover:bg-surface-container transition-colors">
        <div className="flex items-center gap-space-sm mb-space-sm">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
            <Icon name="trending_up" size={20} />
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">
              Avg Order
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight tabular-nums">
              {avgOrderValue}
            </span>
          </div>
        </div>
        <div className="pt-space-xs mt-space-xs flex items-center gap-1.5 text-on-surface-variant">
          <Icon name="check_circle" size={15} className="text-tertiary" />
          <span className="font-label-sm text-label-sm">{deliveredCount} Delivered</span>
        </div>
      </div>

      {/* Sub-Card Right: Devices */}
      <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col justify-between hover:bg-surface-container transition-colors">
        <div className="flex items-center gap-space-sm mb-space-sm">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <Icon name="smartphone" size={20} />
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">
              Devices
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight tabular-nums">
              {devicesCount}
            </span>
          </div>
        </div>
        <div className="pt-space-xs mt-space-xs flex items-center gap-1.5 text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
          <span className="font-label-sm text-label-sm font-semibold">
            {onlineDevicesCount} Connected & Online
          </span>
        </div>
      </div>
    </div>
  );
};
