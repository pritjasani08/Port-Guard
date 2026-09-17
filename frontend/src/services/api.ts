// ============================================================
// PORTGUARD AI — SERVICE LAYER (API ABSTRACTION)
// UI never imports mock data directly — always through this layer.
// ============================================================

import type {
  Camera,
  DetectionEvent,
  SystemInfo,
  AIDetectionStatus,
  IncidentFilters,
  EnvironmentMode,
} from '../types';
import {
  MOCK_CAMERAS,
  MOCK_INCIDENTS,
  MOCK_SYSTEM_INFO,
  MOCK_AI_STATUS,
} from './mockData';

// ===== DATA SOURCE INTERFACE =====
export interface DataSource {
  getCameras(): Promise<Camera[]>;
  getIncidents(filters?: Partial<IncidentFilters>): Promise<DetectionEvent[]>;
  getSystemStatus(): Promise<SystemInfo>;
  getAIStatus(): Promise<AIDetectionStatus>;
  acknowledgeIncident(id: string): Promise<{ success: boolean }>;
}

// ===== REALTIME EVENT SOURCE (for future WebSocket/SSE) =====
export interface RealtimeEventSource {
  connect(): void;
  disconnect(): void;
  onEvent(handler: (event: DetectionEvent) => void): void;
  onStatusChange(handler: (connected: boolean) => void): void;
}

// ===== MOCK DATA SOURCE =====
class MockDataSource implements DataSource {
  async getCameras(): Promise<Camera[]> {
    // Simulate network delay
    await delay(300);
    return structuredClone(MOCK_CAMERAS);
  }

  async getIncidents(filters?: Partial<IncidentFilters>): Promise<DetectionEvent[]> {
    await delay(200);
    let incidents = structuredClone(MOCK_INCIDENTS);

    if (filters) {
      if (filters.eventType && filters.eventType !== 'ALL') {
        incidents = incidents.filter(i => i.eventType === filters.eventType);
      }
      if (filters.severity && filters.severity !== 'ALL') {
        incidents = incidents.filter(i => i.severity === filters.severity);
      }
      if (filters.status && filters.status !== 'ALL') {
        incidents = incidents.filter(i => i.status === filters.status);
      }
      if (filters.cameraId) {
        incidents = incidents.filter(i => i.cameraId === filters.cameraId);
      }
      if (filters.zone) {
        incidents = incidents.filter(i => i.zone === filters.zone);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        incidents = incidents.filter(i =>
          i.cameraName.toLowerCase().includes(q) ||
          i.zone.toLowerCase().includes(q) ||
          i.eventType.toLowerCase().includes(q) ||
          i.cameraId.toLowerCase().includes(q)
        );
      }
    }

    return incidents;
  }

  async getSystemStatus(): Promise<SystemInfo> {
    await delay(200);
    return structuredClone(MOCK_SYSTEM_INFO);
  }

  async getAIStatus(): Promise<AIDetectionStatus> {
    await delay(100);
    return structuredClone(MOCK_AI_STATUS);
  }

  async acknowledgeIncident(id: string): Promise<{ success: boolean }> {
    await delay(300);
    console.log(`[MockDataSource] Acknowledged incident ${id}`);
    return { success: true };
  }
}

// ===== API DATA SOURCE (future FastAPI integration) =====
class ApiDataSource implements DataSource {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await window.fetch(`${this.baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getCameras(): Promise<Camera[]> {
    return this.fetch('/cameras');
  }

  async getIncidents(filters?: Partial<IncidentFilters>): Promise<DetectionEvent[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'ALL') params.append(key, String(value));
      });
    }
    return this.fetch(`/incidents?${params.toString()}`);
  }

  async getSystemStatus(): Promise<SystemInfo> {
    return this.fetch('/system/status');
  }

  async getAIStatus(): Promise<AIDetectionStatus> {
    return this.fetch('/system/ai-status');
  }

  async acknowledgeIncident(id: string): Promise<{ success: boolean }> {
    return this.fetch(`/incidents/${id}/acknowledge`, { method: 'POST' });
  }
}

// ===== MOCK REALTIME SOURCE =====
export class MockRealtimeSource implements RealtimeEventSource {
  private handler: ((event: DetectionEvent) => void) | null = null;
  private statusHandler: ((connected: boolean) => void) | null = null;

  connect(): void {
    this.statusHandler?.(true);
  }

  disconnect(): void {
    this.statusHandler?.(false);
  }

  onEvent(handler: (event: DetectionEvent) => void): void {
    this.handler = handler;
  }

  onStatusChange(handler: (connected: boolean) => void): void {
    this.statusHandler = handler;
  }

  // Called by demo mode to push simulated events
  pushEvent(event: DetectionEvent): void {
    this.handler?.(event);
  }
}

// ===== FACTORY =====
let currentDataSource: DataSource | null = null;
let currentRealtimeSource: MockRealtimeSource | null = null;

export function createDataSource(mode: EnvironmentMode): DataSource {
  if (mode === 'live') {
    currentDataSource = new ApiDataSource();
  } else {
    currentDataSource = new MockDataSource();
  }
  return currentDataSource;
}

export function getRealtimeSource(): MockRealtimeSource {
  if (!currentRealtimeSource) {
    currentRealtimeSource = new MockRealtimeSource();
  }
  return currentRealtimeSource;
}

export function getDataSource(): DataSource {
  if (!currentDataSource) {
    currentDataSource = new MockDataSource();
  }
  return currentDataSource;
}

// ===== HELPER =====
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
