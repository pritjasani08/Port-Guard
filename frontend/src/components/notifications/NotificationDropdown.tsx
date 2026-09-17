// ============================================================
// PORTGUARD AI — NOTIFICATION DROPDOWN
// ============================================================

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { useNotifications } from '../../context/AppContext';
import { getEventConfig, getSeverityConfig } from '../../utils/formatting';
import { formatRelativeTime } from '../../utils/formatting';
import './NotificationDropdown.css';

interface Props {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: Props) {
  const { notifications, markRead, clearAll } = useNotifications();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // Close on escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="notif-dropdown animate-slide-down" ref={ref} role="dialog" aria-label="Notifications">
      <div className="notif-dropdown__header">
        <h3>Notifications</h3>
        {notifications.length > 0 && (
          <button className="notif-dropdown__clear" onClick={clearAll} aria-label="Clear all notifications">
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      <div className="notif-dropdown__list">
        {notifications.length === 0 ? (
          <div className="notif-dropdown__empty">
            <Bell size={24} />
            <span>No notifications</span>
          </div>
        ) : (
          notifications.slice(0, 10).map(notif => {
            const eventCfg = getEventConfig(notif.eventType);
            const sevCfg = getSeverityConfig(notif.severity);
            return (
              <div
                key={notif.id}
                className={`notif-dropdown__item ${!notif.read ? 'notif-dropdown__item--unread' : ''}`}
              >
                <div className="notif-dropdown__item-dot" style={{ background: sevCfg.color }} />
                <div className="notif-dropdown__item-content">
                  <span className="notif-dropdown__item-event" style={{ color: sevCfg.color }}>
                    {eventCfg.emoji} {eventCfg.label}
                  </span>
                  <span className="notif-dropdown__item-meta">
                    {notif.cameraId} — {notif.zone}
                  </span>
                  <span className="notif-dropdown__item-time">
                    {formatRelativeTime(notif.timestamp)}
                  </span>
                </div>
                <div className="notif-dropdown__item-actions">
                  {!notif.read && (
                    <button
                      onClick={() => markRead(notif.id)}
                      data-tooltip="Mark as read"
                      aria-label="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => { navigate('/alerts'); onClose(); }}
                    data-tooltip="View"
                    aria-label="View incident"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
