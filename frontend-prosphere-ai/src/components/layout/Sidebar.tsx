'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { NAVIGATION_GROUPS } from '@/data/dashboardData';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-surface-container-low border-r border-outline-variant/30 z-50 flex flex-col justify-between overflow-y-auto">
      {/* Brand & Navigation */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <Link
          href="/dashboard"
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

        {/* Navigation Groups */}
        <nav className="flex flex-col gap-y-space-md px-space-sm pt-space-md">
          {NAVIGATION_GROUPS.map((group) => (
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
