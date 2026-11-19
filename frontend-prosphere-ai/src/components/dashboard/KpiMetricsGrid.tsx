import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { KPI_METRICS } from '@/data/dashboardData';
import { KpiMetric } from '@/types/dashboard';

interface KpiMetricsGridProps {
  metrics?: KpiMetric[];
}

export const KpiMetricsGrid: React.FC<KpiMetricsGridProps> = ({
  metrics = KPI_METRICS,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md mb-space-lg">
      {metrics.map((metric, idx) => {
        const isFifth = idx === 4;
        const iconTextColor =
          metric.iconVariant === 'secondary'
            ? 'text-secondary'
            : metric.iconVariant === 'tertiary'
            ? 'text-tertiary'
            : 'text-primary';

        const gradientAccent =
          metric.accentColor === 'secondary'
            ? 'via-secondary/30'
            : metric.accentColor === 'tertiary'
            ? 'via-tertiary/30'
            : 'via-primary/30';

        const fillIcon =
          metric.icon === 'forum' ||
          metric.icon === 'check_circle' ||
          metric.icon === 'shopping_cart';

        return (
          <div
            key={metric.id}
            className={`${
              isFifth ? 'col-span-2 md:col-span-1' : ''
            } bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between hover:bg-surface-container transition-colors shadow-sm relative overflow-hidden group`}
          >
            {/* Top row with icon & badge */}
            <div className="flex items-center justify-between mb-space-md">
              <div
                className={`w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center ${iconTextColor} group-hover:scale-105 transition-transform`}
              >
                <Icon name={metric.icon} size={20} fill={fillIcon} />
              </div>
              <Badge label={metric.badge.label} variant={metric.badge.variant} />
            </div>

            {/* Metric content */}
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase block font-semibold">
                {metric.title}
              </span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold mt-1 tracking-tight tabular-nums block">
                {metric.value}
              </span>
            </div>

            {/* Bottom Glow Border on Hover */}
            <div
              className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent ${gradientAccent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
            />
          </div>
        );
      })}
    </div>
  );
};
