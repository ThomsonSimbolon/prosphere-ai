'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

const HEADER_ACTIONS = [
  {
    id: 'send',
    label: 'Send Message',
    icon: 'send',
    path: '/single-message',
    borderColor: 'border-secondary/30',
    textColor: 'text-secondary',
    hoverBg: 'hover:bg-secondary/10',
  },
  {
    id: 'bulk',
    label: 'Bulk Message',
    icon: 'forward_to_inbox',
    path: '/bulk-messages',
    borderColor: 'border-outline-variant',
    textColor: 'text-tertiary-fixed',
    hoverBg: 'hover:bg-surface-container-high',
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: 'layers',
    path: '/templates',
    borderColor: 'border-outline-variant',
    textColor: 'text-primary-fixed-dim',
    hoverBg: 'hover:bg-surface-container-high',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: 'person_search',
    path: '/contacts',
    borderColor: 'border-outline-variant',
    textColor: 'text-tertiary',
    hoverBg: 'hover:bg-surface-container-high',
  },
  {
    id: 'chat-history',
    label: 'Chat History',
    icon: 'forum',
    path: '/chat-history',
    borderColor: 'border-outline-variant',
    textColor: 'text-secondary-fixed-dim',
    hoverBg: 'hover:bg-surface-container-high',
  },
];

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-60 right-0 h-[60px] bg-surface-container-low border-b border-outline-variant/30 z-40 flex items-center justify-between px-space-lg">
      {/* Quick Action Chips */}
      <div className="flex items-center gap-space-xs overflow-x-auto">
        {HEADER_ACTIONS.map((action) => (
          <Link
            key={action.id}
            href={action.path}
            className={`flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container font-label-md text-label-md transition-colors ${action.borderColor} ${action.textColor} ${action.hoverBg}`}
          >
            <Icon name={action.icon} size={16} />
            <span>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md shrink-0">
        <Link
          href="/ai-settings"
          aria-label="Settings"
          className="flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <Icon name="settings" size={20} />
        </Link>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <Icon name="notifications" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary" />
        </button>

        <div
          role="button"
          tabIndex={0}
          aria-label="User Profile"
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Icon name="person" size={18} className="text-on-primary" />
        </div>
      </div>
    </header>
  );
};
