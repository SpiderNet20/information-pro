import React from 'react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg">
      <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
      <span>وضع عدم الاتصال بالإنترنت — يتم عرض النسخة المحفوظة (PWA)</span>
    </div>
  );
};
