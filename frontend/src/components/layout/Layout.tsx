// ============================================================
// PORTGUARD AI — ROOT LAYOUT
// ============================================================

import { Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

export default function Layout() {
  const { state } = useApp();

  return (
    <div className={`layout ${state.sidebarCollapsed ? 'layout--collapsed' : ''}`}>
      <Sidebar />
      <Topbar />
      <main className="layout__content" role="main">
        <Outlet />
        <footer className="layout__footer">
          <span>PortGuard AI — AI-Powered Port Safety Monitoring</span>
          <span className="layout__footer-sep">·</span>
          <span>Prototype v1.0</span>
          <span className="layout__footer-sep">·</span>
          <span className="layout__footer-disclaimer">
            AI monitoring is decision-support and does not replace trained safety personnel.
          </span>
        </footer>
      </main>
    </div>
  );
}
