import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { ORDER_STATISTICS } from '@/data/dashboardData';
import { OrderStatItem } from '@/types/dashboard';

interface OrderStatisticsCardProps {
  items?: OrderStatItem[];
}

export const OrderStatisticsCard: React.FC<OrderStatisticsCardProps> = ({
  items = ORDER_STATISTICS,
}) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-space-sm mb-space-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
          Order Statistics
        </h2>
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon name="receipt_long" size={16} />
        </div>
      </div>

      {/* Stacked inner list cards */}
      <div className="flex flex-col gap-2.5">
        {items.map((item) => {
          const iconColorClass =
            item.iconColor === 'secondary'
              ? 'text-secondary'
              : item.iconColor === 'tertiary'
              ? 'text-tertiary'
              : 'text-primary';

          return (
            <div
              key={item.id}
              className="bg-surface-container p-3 rounded-lg flex items-center justify-between hover:bg-surface-variant transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded bg-surface-container-high flex items-center justify-center ${iconColorClass} group-hover:scale-105 transition-transform`}
                >
                  <Icon name={item.icon} size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold tabular-nums leading-tight">
                    {item.value}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {item.title}
                  </span>
                </div>
              </div>

              {item.badge && (
                <Badge label={item.badge.label} variant={item.badge.variant} />
              )}

              {item.hasChevron && (
                <Icon
                  name="chevron_right"
                  size={18}
                  className="text-outline opacity-40"
                />
              )}

              {item.hasTrendIcon && (
                <div className="flex items-center text-secondary text-xs">
                  <Icon name="show_chart" size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
