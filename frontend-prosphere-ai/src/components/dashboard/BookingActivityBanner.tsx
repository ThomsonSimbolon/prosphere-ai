import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

interface BookingActivityBannerProps {
  title?: string;
  subtitle?: string;
  href?: string;
}

export const BookingActivityBanner: React.FC<BookingActivityBannerProps> = ({
  title = 'Booking Activity',
  subtitle = '— 7 days past & future',
  href = '#',
}) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-space-sm">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon name="event_available" size={20} />
        </div>
        <div className="flex flex-wrap items-center gap-x-2">
          <span className="font-label-lg text-label-lg text-on-surface font-bold">
            {title}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {subtitle}
          </span>
        </div>
      </div>

      <Link
        href={href}
        className="font-label-md text-label-md text-primary hover:text-primary-fixed flex items-center gap-1 font-semibold group self-end sm:self-auto transition-colors"
      >
        <span>View all</span>
        <Icon
          name="arrow_forward"
          size={16}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </Link>
    </div>
  );
};
