'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useAuth, UserRole } from '@/context/AuthContext';

const ALL_HEADER_ACTIONS = [
  {
    id: 'send',
    label: 'Send Message',
    icon: 'send',
    path: '/single-message',
    borderColor: 'border-secondary/30',
    textColor: 'text-secondary',
    hoverBg: 'hover:bg-secondary/10',
    allowedRoles: ['SUPER_ADMIN'] as UserRole[],
  },
  {
    id: 'bulk',
    label: 'Bulk Message',
    icon: 'forward_to_inbox',
    path: '/bulk-messages',
    borderColor: 'border-outline-variant',
    textColor: 'text-tertiary-fixed',
    hoverBg: 'hover:bg-surface-container-high',
    allowedRoles: ['SUPER_ADMIN', 'STAFF_MARKETING'] as UserRole[],
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: 'layers',
    path: '/templates',
    borderColor: 'border-outline-variant',
    textColor: 'text-primary-fixed-dim',
    hoverBg: 'hover:bg-surface-container-high',
    allowedRoles: ['SUPER_ADMIN', 'STAFF_MARKETING'] as UserRole[],
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: 'person_search',
    path: '/contacts',
    borderColor: 'border-outline-variant',
    textColor: 'text-tertiary',
    hoverBg: 'hover:bg-surface-container-high',
    allowedRoles: ['SUPER_ADMIN', 'STAFF_SALES_CS'] as UserRole[],
  },
  {
    id: 'chat-history',
    label: 'Chat History',
    icon: 'forum',
    path: '/chat-history',
    borderColor: 'border-outline-variant',
    textColor: 'text-secondary-fixed-dim',
    hoverBg: 'hover:bg-surface-container-high',
    allowedRoles: ['SUPER_ADMIN', 'STAFF_SALES_CS'] as UserRole[],
  },
];

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter actions based on role
  const visibleActions = ALL_HEADER_ACTIONS.filter((action) =>
    user ? action.allowedRoles.includes(user.role) : false
  );

  return (
    <header className="fixed top-0 left-60 right-0 h-[60px] bg-surface-container-low border-b border-outline-variant/30 z-40 flex items-center justify-between px-space-lg">
      {/* Quick Action Chips (Filtered by role) */}
      <div className="flex items-center gap-space-xs overflow-x-auto">
        {visibleActions.map((action) => (
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
        {/* Settings shortcut - only for Super Admin */}
        {user?.role === 'SUPER_ADMIN' && (
          <Link
            href="/ai-settings"
            aria-label="Settings"
            className="flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Icon name="settings" size={20} />
          </Link>
        )}

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <Icon name="notifications" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* User Profile & Logout Popover */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="User Profile"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-primary/20"
          >
            <span className="text-on-primary font-bold text-label-md">
              {user ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-high border border-outline-variant/30 rounded-2xl p-space-sm shadow-2xl z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-outline-variant/20 mb-2">
                <div className="font-bold text-on-surface text-body-md truncate">
                  {user?.name || 'Guest User'}
                </div>
                <div className="text-outline text-label-sm truncate">
                  {user?.email || 'Belum masuk'}
                </div>
                <div className="mt-1.5">
                  <span
                    className={`inline-block font-label-sm text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      user?.role === 'SUPER_ADMIN'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : user?.role === 'STAFF_SALES_CS'
                        ? 'bg-secondary/20 text-secondary border border-secondary/30'
                        : 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                    }`}
                  >
                    {user?.role === 'SUPER_ADMIN'
                      ? '👑 Super Admin'
                      : user?.role === 'STAFF_SALES_CS'
                      ? '💼 Sales & CS'
                      : '📢 Marketing'}
                  </span>
                </div>
              </div>

              {user?.role === 'SUPER_ADMIN' && (
                <Link
                  href="/user-management"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-variant transition-colors text-label-md font-medium"
                >
                  <Icon name="manage_accounts" size={18} />
                  <span>Kelola Akun Staf</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-error hover:bg-error/10 transition-colors text-label-md font-semibold cursor-pointer"
              >
                <Icon name="logout" size={18} />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
