// ============================================================
// PORTGUARD AI — SIDEBAR NAVIGATION
// ============================================================

import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MonitorPlay, Camera, TriangleAlert,
  FileWarning, BarChart3, Server, Settings,
  Shield, ChevronLeft, ChevronRight, Flame, Wind, HardHat, ShieldOff, RotateCcw, User,
} from 'lucide-react';
import { NAV_ITEMS } from '../../utils/constants';
import { useDemoMode, useApp } from '../../context/AppContext';
import './Sidebar.css';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, MonitorPlay, Camera, TriangleAlert,
  FileWarning, BarChart3, Server, Settings,
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { demoMode, simulateEvent, clearDemoData } = useDemoMode();

  const grouped = NAV_ITEMS.reduce<Record<string, typeof NAV_ITEMS>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <aside className={`sidebar ${state.sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Shield size={24} />
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">PORTGUARD AI</span>
          <span className="sidebar__brand-sub">Port Safety Command</span>
        </div>
        <button
          className="sidebar__collapse-btn"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          aria-label={state.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {state.sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav" role="navigation" aria-label="Main navigation">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="sidebar__group">
            <span className="sidebar__group-label">{group}</span>
            {items.map(item => {
              const Icon = ICON_MAP[item.icon];
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
                  onClick={() => navigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="sidebar__item-icon">
                    {Icon && <Icon size={18} />}
                  </span>
                  <span className="sidebar__item-label">{item.label}</span>
                  {isActive && <span className="sidebar__item-indicator" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Demo Controls */}
      {demoMode && (
        <div className="sidebar__demo">
          <div className="sidebar__demo-header">
            <span className="sidebar__demo-dot" />
            <span className="sidebar__demo-label">DEMO MODE</span>
          </div>
          <div className="sidebar__demo-actions">
            <button className="sidebar__demo-btn sidebar__demo-btn--critical" onClick={() => simulateEvent('FIRE_DETECTED')}>
              <Flame size={14} /> Simulate Fire
            </button>
            <button className="sidebar__demo-btn sidebar__demo-btn--warning" onClick={() => simulateEvent('SMOKE_DETECTED')}>
              <Wind size={14} /> Simulate Smoke
            </button>
            <button className="sidebar__demo-btn sidebar__demo-btn--warning" onClick={() => simulateEvent('HELMET_MISSING')}>
              <HardHat size={14} /> Helmet Missing
            </button>
            <button className="sidebar__demo-btn sidebar__demo-btn--warning" onClick={() => simulateEvent('SAFETY_JACKET_MISSING')}>
              <ShieldOff size={14} /> Jacket Missing
            </button>
            <button className="sidebar__demo-btn sidebar__demo-btn--reset" onClick={clearDemoData}>
              <RotateCcw size={14} /> Reset Demo
            </button>
          </div>
        </div>
      )}

      {/* Operator */}
      <div className="sidebar__operator">
        <div className="sidebar__operator-avatar">
          <User size={18} />
        </div>
        <div className="sidebar__operator-info">
          <span className="sidebar__operator-name">Safety Operator</span>
          <span className="sidebar__operator-status">
            <span className="status-dot status-dot--online" /> Online
          </span>
        </div>
      </div>
    </aside>
  );
}
