/**
 * CostcoTrendTracker — メインアプリケーション
 */
import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NotificationPanel from './components/NotificationPanel';
import { useApi } from './hooks/useApi';

export default function App() {
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: notifications } = useApi('/favorites/notifications');

  const unreadCount = (notifications || []).filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar
        notificationCount={unreadCount}
        onNotificationClick={() => setNotifOpen(prev => !prev)}
      />

      <main>
        <Dashboard />
      </main>

      <NotificationPanel
        notifications={notifications || []}
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </div>
  );
}
