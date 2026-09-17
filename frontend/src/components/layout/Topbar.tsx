// ============================================================
// PORTGUARD AI — TOP HEADER BAR
// ============================================================

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, CircleCheck, CircleAlert, Clock } from 'lucide-react';
import { useApp, useNotifications } from '../../context/AppContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { NAV_ITEMS } from '../../utils/constants';
import './Topbar.css';

export default function Topbar() {
  const location = useLocation();
  const { state, dispatch } = useApp();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentPage = NAV_ITEMS.find(item => item.path === location.pathname);
  const pageTitle = currentPage?.label || 'Dashboard';

  const allOperational = state.systemInfo.services.length === 0 ||
    state.systemInfo.services.every(s => s.status === 'OPERATIONAL');

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          className="topbar__menu-btn"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <div className="topbar__title-group">
          <h1 className="topbar__title">{pageTitle}</h1>
          <span className="topbar__subtitle">Port Safety Command Center</span>
        </div>
      </div>

      <div className="topbar__right">
        {/* Environment indicator */}
        <div className={`topbar__env ${state.demoMode ? 'topbar__env--demo' : 'topbar__env--live'}`}>
          <span className="topbar__env-dot" />
          <span className="topbar__env-label">
            {state.demoMode ? 'DEMO ENVIRONMENT' : 'LIVE SYSTEM'}
          </span>
        </div>

        {/* System status */}
        <div className={`topbar__status ${allOperational ? 'topbar__status--ok' : 'topbar__status--warn'}`}>
          {allOperational ? <CircleCheck size={14} /> : <CircleAlert size={14} />}
          <span>{allOperational ? 'ALL SYSTEMS OPERATIONAL' : 'SYSTEM ISSUE'}</span>
        </div>

        {/* Clock */}
        <div className="topbar__clock" aria-label="Current time">
          <Clock size={14} />
          <span>
            {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Notifications */}
        <div className="topbar__notif-wrapper">
          <button
            className="topbar__notif-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="topbar__notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>
      </div>
    </header>
  );
}
