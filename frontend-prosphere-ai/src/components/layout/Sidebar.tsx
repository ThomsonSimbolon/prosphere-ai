'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useAuth, UserRole } from '@/context/AuthContext';
import { NavGroup, NavItem } from '@/types/dashboard';

const BASE_NAVIGATION_GROUPS: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
      { id: 'devices', label: 'Devices', icon: 'smartphone', path: '/devices' },
      { id: 'chat-history', label: 'Chat History', icon: 'chat', path: '/chat-history', badge: '99+' },
      { id: 'crm', label: 'CRM', icon: 'bar_chart', path: '/crm' },
      { id: 'bookings', label: 'Bookings', icon: 'calendar_today', path: '/bookings' },
      { id: 'scheduled-jobs', label: 'Scheduled Jobs', icon: 'schedule', path: '/scheduled-jobs' },
    ],
  },
  {
    title: 'MESSAGING',
    items: [
      { id: 'single-message', label: 'Single Message', icon: 'mail', path: '/single-message' },
      { id: 'bulk-messages', label: 'Bulk Messages', icon: 'send', path: '/bulk-messages' },
      { id: 'templates', label: 'Templates', icon: 'dashboard_customize', path: '/templates' },
    ],
  },
  {
    title: 'CONTACTS',
    items: [
      { id: 'contacts', label: 'Contacts', icon: 'contacts', path: '/contacts' },
      { id: 'groups', label: 'Groups', icon: 'group', path: '/groups' },
    ],
  },
  {
    title: 'AI AUTOMATION',
    items: [
      { id: 'ai-settings', label: 'AI Settings', icon: 'memory', path: '/ai-settings' },
      { id: 'chatbot-flows', label: 'Chatbot Flows', icon: 'account_tree', path: '/chatbot-flows' },
      { id: 'ai-sales-agent', label: 'AI Sales Agent', icon: 'auto_awesome', path: '/ai-sales-agent' },
    ],
  },
];

// Helper penyaring menu navigasi berdasarkan role
function filterNavigationByRole(role?: UserRole): NavGroup[] {
  if (!role) return [];

  if (role === 'SUPER_ADMIN') {
    // Tambahkan User Management di kelompok OVERVIEW / ADMINISTRATION
    const groups = JSON.parse(JSON.stringify(BASE_NAVIGATION_GROUPS)) as NavGroup[];
    groups[0].items.push({
      id: 'user-management',
      label: 'User Management',
      icon: 'manage_accounts',
      path: '/user-management',
      badge: 'Admin',
    });
    return groups;
  }

  if (role === 'STAFF_SALES_CS') {
    // Hanya Chat History, CRM, Bookings, Contacts
    const allowedPaths = ['/chat-history', '/crm', '/bookings', '/contacts'];
    const filteredGroups: NavGroup[] = [];

    BASE_NAVIGATION_GROUPS.forEach((group) => {
      const allowedItems = group.items.filter((item) => allowedPaths.includes(item.path));
      if (allowedItems.length > 0) {
        filteredGroups.push({
          title: group.title,
          items: allowedItems,
        });
      }
    });

    return filteredGroups;
  }

  if (role === 'STAFF_MARKETING') {
    // Hanya Bulk Messages, Templates, Groups
    const allowedPaths = ['/bulk-messages', '/templates', '/groups'];
    const filteredGroups: NavGroup[] = [];

    BASE_NAVIGATION_GROUPS.forEach((group) => {
      const allowedItems = group.items.filter((item) => allowedPaths.includes(item.path));
      if (allowedItems.length > 0) {
        filteredGroups.push({
          title: group.title,
          items: allowedItems,
        });
      }
    });

    return filteredGroups;
  }

  return [];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigationGroups = filterNavigationByRole(user?.role);

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-surface-container-low border-r border-outline-variant/30 z-50 flex flex-col justify-between overflow-y-auto">
      {/* Brand & Navigation */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <Link
          href={user?.role === 'SUPER_ADMIN' ? '/dashboard' : user?.role === 'STAFF_SALES_CS' ? '/chat-history' : '/bulk-messages'}
          className="px-space-md pt-space-lg pb-space-md border-b border-outline-variant/20 block hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              ProSphere
            </span>
            <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-space-xs py-0.5 rounded font-bold">
              AI
            </span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant/80 mt-1.5 leading-tight">
            Manage your leads all in one place.!
          </p>
        </Link>

        {/* User Role Banner */}
        {user && (
          <div className="px-space-sm pt-space-sm">
            <div className="px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
                Peran Akun
              </span>
              <span
                className={`font-label-sm text-label-sm px-1.5 py-0.2 rounded font-bold ${
                  user.role === 'SUPER_ADMIN'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : user.role === 'STAFF_SALES_CS'
                    ? 'bg-secondary/20 text-secondary border border-secondary/30'
                    : 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                }`}
              >
                {user.role === 'SUPER_ADMIN'
                  ? 'Super Admin'
                  : user.role === 'STAFF_SALES_CS'
                  ? 'Sales & CS'
                  : 'Marketing'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="flex flex-col gap-y-space-md px-space-sm pt-space-md">
          {navigationGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-0.5">
              <span className="px-space-sm pb-1 font-label-sm text-label-sm text-outline uppercase tracking-wider">
                {group.title}
              </span>
              {group.items.map((item) => {
                const isActive =
                  item.path === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between px-space-sm py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-surface-variant text-on-surface font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <Icon
                        name={item.icon}
                        size={18}
                        className={isActive ? 'text-primary' : ''}
                      />
                      <span className="font-label-md text-label-md">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container font-bold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-space-sm flex flex-col gap-space-xs border-t border-outline-variant/20">
        <div className="flex items-center justify-between px-space-xs font-label-sm text-label-sm text-outline">
          <span className="leading-none">Made in Sri Lanka</span>
          <span className="leading-none font-mono">v1.0.0</span>
        </div>

        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-space-xs bg-secondary-container hover:bg-secondary text-surface-container-lowest font-headline-sm text-label-lg py-2 px-space-sm rounded-lg transition-colors shadow-sm font-semibold"
        >
          <Icon name="chat" size={18} />
          <span>WhatsApp Support</span>
        </a>

        <div className="text-center font-label-sm text-label-sm text-outline/80 leading-tight pt-0.5">
          Zenax Web Solutions · Digital Innovation Partner
        </div>
      </div>
    </aside>
  );
};
