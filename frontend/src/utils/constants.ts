// ============================================================
// PORTGUARD AI — CONSTANTS & MAPPINGS
// ============================================================

import type { EventType, Severity, SafetyRule } from '../types';

// ===== EVENT TYPE CONFIG =====
export interface EventConfig {
  label: string;
  shortLabel: string;
  icon: string; // Lucide icon name
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const EVENT_CONFIG: Record<EventType, EventConfig> = {
  FIRE_DETECTED: {
    label: 'Fire Detected',
    shortLabel: 'Fire',
    icon: 'Flame',
    emoji: '🔥',
    color: 'var(--critical)',
    bgColor: 'var(--critical-bg)',
    borderColor: 'var(--critical-border)',
  },
  SMOKE_DETECTED: {
    label: 'Smoke Detected',
    shortLabel: 'Smoke',
    icon: 'CloudFog',
    emoji: '💨',
    color: 'var(--warning)',
    bgColor: 'var(--warning-bg)',
    borderColor: 'var(--warning-border)',
  },
  HELMET_MISSING: {
    label: 'Helmet Missing',
    shortLabel: 'Helmet',
    icon: 'HardHat',
    emoji: '⛑️',
    color: 'var(--warning)',
    bgColor: 'var(--warning-bg)',
    borderColor: 'var(--warning-border)',
  },
  SAFETY_JACKET_MISSING: {
    label: 'Safety Jacket Missing',
    shortLabel: 'Jacket',
    icon: 'ShieldOff',
    emoji: '🦺',
    color: 'var(--warning)',
    bgColor: 'var(--warning-bg)',
    borderColor: 'var(--warning-border)',
  },
  PPE_COMPLIANT: {
    label: 'PPE Compliant',
    shortLabel: 'Compliant',
    icon: 'ShieldCheck',
    emoji: '✅',
    color: 'var(--safe)',
    bgColor: 'var(--safe-bg)',
    borderColor: 'var(--safe-border)',
  },
};

// ===== SEVERITY CONFIG =====
export interface SeverityConfig {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  priority: number;
}

export const SEVERITY_CONFIG: Record<Severity, SeverityConfig> = {
  CRITICAL: {
    label: 'Critical',
    icon: 'CircleAlert',
    color: 'var(--critical)',
    bgColor: 'var(--critical-bg)',
    borderColor: 'var(--critical-border)',
    priority: 0,
  },
  HIGH: {
    label: 'High',
    icon: 'TriangleAlert',
    color: 'var(--warning)',
    bgColor: 'var(--warning-bg)',
    borderColor: 'var(--warning-border)',
    priority: 1,
  },
  NORMAL: {
    label: 'Normal',
    icon: 'CircleCheck',
    color: 'var(--safe)',
    bgColor: 'var(--safe-bg)',
    borderColor: 'var(--safe-border)',
    priority: 2,
  },
};

// ===== ZONES =====
export const ZONES = [
  'Container Yard A',
  'Container Yard B',
  'Loading Zone A',
  'Loading Zone B',
  'Cargo Area',
  'Gate Entrance',
  'Gate Exit',
  'Berth 1',
  'Berth 2',
  'Warehouse',
  'Admin Block',
  'Fuel Storage',
] as const;

// ===== SAFETY RULES (for visualization) =====
export const SAFETY_RULES: SafetyRule[] = [
  {
    id: 'FIRE_RULE',
    name: 'Fire Detection',
    description: 'Detects fire in camera feed',
    detectionInput: 'FIRE object detected by YOLOv8',
    evaluationStep: 'Confidence ≥ 70% across multiple frames',
    possibleOutcome: 'CRITICAL — Fire Incident',
    severity: 'CRITICAL',
    eventType: 'FIRE_DETECTED',
  },
  {
    id: 'SMOKE_RULE',
    name: 'Smoke Detection',
    description: 'Detects smoke in camera feed',
    detectionInput: 'SMOKE object detected by YOLOv8',
    evaluationStep: 'Confidence ≥ 60% across multiple frames',
    possibleOutcome: 'HIGH — Smoke Warning',
    severity: 'HIGH',
    eventType: 'SMOKE_DETECTED',
  },
  {
    id: 'HELMET_RULE',
    name: 'Helmet Compliance',
    description: 'Checks if detected persons are wearing helmets',
    detectionInput: 'PERSON detected without HELMET',
    evaluationStep: 'Person present but no helmet in proximity',
    possibleOutcome: 'HIGH — PPE Violation',
    severity: 'HIGH',
    eventType: 'HELMET_MISSING',
  },
  {
    id: 'JACKET_RULE',
    name: 'Safety Jacket Compliance',
    description: 'Checks if detected persons are wearing safety jackets',
    detectionInput: 'PERSON detected without SAFETY JACKET',
    evaluationStep: 'Person present but no jacket in proximity',
    possibleOutcome: 'HIGH — PPE Violation',
    severity: 'HIGH',
    eventType: 'SAFETY_JACKET_MISSING',
  },
];

// ===== YOLOv8 CLASS LABELS =====
export const YOLO_CLASSES = ['PERSON', 'HELMET', 'SAFETY_JACKET', 'FIRE', 'SMOKE'] as const;

// ===== TRUST LANGUAGE =====
export const TRUST_STRINGS = {
  disclaimer: 'AI monitoring is decision-support and does not replace trained safety personnel.',
  confidence: 'AI Detection Confidence',
  assisted: 'AI-Assisted Safety Monitoring',
  verification: 'Requires operator verification',
  decisionSupport: 'Decision-support system',
} as const;

// ===== NAV ITEMS =====
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  group: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard', group: 'OVERVIEW' },
  { label: 'Live Monitoring', path: '/monitoring', icon: 'MonitorPlay', group: 'MONITORING' },
  { label: 'Cameras', path: '/cameras', icon: 'Camera', group: 'MONITORING' },
  { label: 'Active Alerts', path: '/alerts', icon: 'TriangleAlert', group: 'SAFETY' },
  { label: 'Incident History', path: '/incidents', icon: 'FileWarning', group: 'SAFETY' },
  { label: 'Safety Analytics', path: '/analytics', icon: 'BarChart3', group: 'ANALYTICS' },
  { label: 'System Status', path: '/system', icon: 'Server', group: 'SYSTEM' },
  { label: 'Settings', path: '/settings', icon: 'Settings', group: 'SYSTEM' },
];
