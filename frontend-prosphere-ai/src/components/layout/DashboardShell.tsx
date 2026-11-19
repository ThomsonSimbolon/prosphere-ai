import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  return (
    <div className="bg-surface text-on-surface min-h-screen font-body-md text-body-md antialiased">
      <Sidebar />
      <div className="pl-60">
        <Header />
        <main className="relative pt-[60px] w-full px-space-lg bg-surface min-h-screen">
          <div className="flex flex-col w-full pb-space-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
