import type { Page, Request, TestInfo } from '@playwright/test';

export const NETWORK_ATTACHMENT = 'network-metrics';
const TARGET_HOST = 'saucedemo.com';

const SPA_FALLBACK_PATHS = [
  '/inventory.html',
  '/dynamic-catalog-lazy-load.html',
  '/dynamic-catalog-spinner.html',
];

export interface RequestMetric {
  url: string;
  method: string;
  resourceType: string;
  status: number | null; 
  ttfbMs: number | null; 
  durationMs: number; 
}

export interface NetworkSummary {
  requestCount: number;
  failedCount: number; 
  spaFallbackCount: number; 
  abortedCount: number; 
  avgMs: number;
  p95Ms: number;
  maxMs: number;
  requests: RequestMetric[];
}

export function isSpaFallback(r: RequestMetric): boolean {
  if (r.resourceType !== 'document' || r.status !== 404) return false;
  try {
    return SPA_FALLBACK_PATHS.includes(new URL(r.url).pathname);
  } catch {
    return false;
  }
}

export function summarize(requests: RequestMetric[]): NetworkSummary {
  const durations = requests.map((r) => r.durationMs).sort((a, b) => a - b);
  const n = durations.length;
  const sum = durations.reduce((acc, d) => acc + d, 0);

  return {
    requestCount: n,
    failedCount: requests.filter((r) => r.status !== null && r.status >= 400 && !isSpaFallback(r)).length,
    spaFallbackCount: requests.filter(isSpaFallback).length,
    abortedCount: requests.filter((r) => r.status === null).length,
    avgMs: n ? Math.round(sum / n) : 0,
    p95Ms: n ? durations[Math.max(0, Math.ceil(n * 0.95) - 1)] : 0,
    maxMs: n ? durations[n - 1] : 0,
    requests,
  };
}


export class NetworkTimingCollector {
  private starts = new Map<Request, number>();
  private pending: Promise<void>[] = [];
  private metrics: RequestMetric[] = [];

  constructor(page: Page) {
    page.on('request', (req) => {
      if (this.isTarget(req)) this.starts.set(req, Date.now());
    });
    page.on('requestfinished', (req) => this.pending.push(this.record(req)));
    page.on('requestfailed', (req) => this.pending.push(this.record(req)));
  }

  private isTarget(req: Request): boolean {
    try {
      return new URL(req.url()).hostname.endsWith(TARGET_HOST);
    } catch {
      return false;
    }
  }

  private async record(req: Request): Promise<void> {
    const start = this.starts.get(req);
    if (start === undefined) return;

    const timing = req.timing();
    const response = await req.response().catch(() => null);
    const fallbackMs = Date.now() - start;

    this.metrics.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      status: response ? response.status() : null,
      ttfbMs: timing.responseStart >= 0 ? Math.round(timing.responseStart) : null,
      durationMs: timing.responseEnd > 0 ? Math.round(timing.responseEnd) : fallbackMs,
    });
  }

  async attach(testInfo: TestInfo): Promise<void> {
    await Promise.allSettled(this.pending);
    await testInfo.attach(NETWORK_ATTACHMENT, {
      body: JSON.stringify(summarize(this.metrics), null, 2),
      contentType: 'application/json',
    });
  }
}