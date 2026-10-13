/// <reference types="node" />

import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import { NETWORK_ATTACHMENT, summarize, type NetworkSummary, type RequestMetric } from '../utils/NetworkTimingCollector';


const SLOW_REQUEST_MS = Number(process.env.SLOW_REQUEST_MS ?? 1000);
const P95_BUDGET_MS = Number(process.env.P95_BUDGET_MS ?? 1500);
const OUT_DIR = 'performance-report';

interface Row {
  title: string;
  project: string;
  status: string;
  testMs: number;
  net: NetworkSummary;
}

const flag = (ms: number, limit: number) => (ms > limit ? ' ⚠️' : '');
const pathOf = (url: string) => {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
};

export default class PerformanceReporter implements Reporter {
  private rows = new Map<string, Row>(); 

  onTestEnd(test: TestCase, result: TestResult): void {
    const attachment = result.attachments.find((a) => a.name === NETWORK_ATTACHMENT);
    if (!attachment?.body) return;

    this.rows.set(test.id, {
      title: test.titlePath().slice(3).join(' › '),
      project: test.parent.project()?.name ?? '',
      status: result.status,
      testMs: result.duration,
      net: JSON.parse(attachment.body.toString()) as NetworkSummary,
    });
  }

  onEnd(): void {
    const rows = [...this.rows.values()];
    if (!rows.length) return;

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, 'network-performance.json'), JSON.stringify(rows, null, 2));

    const markdown = this.buildMarkdown(rows);
    fs.writeFileSync(path.join(OUT_DIR, 'network-performance.md'), markdown);
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);

    const all = summarize(rows.flatMap((r) => r.net.requests));
    console.log(
      `\n[performance] ${all.requestCount} requests | avg ${all.avgMs}ms | p95 ${all.p95Ms}ms | max ${all.maxMs}ms` +
        ` | HTTP errors ${all.failedCount} | SPA 404 (expected) ${all.spaFallbackCount} | aborted ${all.abortedCount}` +
        `\n[performance] report: ${OUT_DIR}/network-performance.md\n`,
    );
  }

  private buildMarkdown(rows: Row[]): string {
    const all = rows.flatMap((r) => r.net.requests);
    const total = summarize(all);
    const out: string[] = [];

    out.push('# Network performance report (saucedemo.com)\n');
    out.push(`Budgets: slow request > ${SLOW_REQUEST_MS} ms, p95 per test > ${P95_BUDGET_MS} ms. Informational only: they do not fail the run.\n`);
    out.push('Notes: direct navigation to internal routes returns HTTP 404 from the SauceDemo server (SPA fallback) while the app still renders; these are reported as "SPA 404 (expected)". "Aborted" are requests cancelled when a test finishes or navigates away (mostly product images).\n');

    out.push('## Overall\n');
    out.push('| Tests | Requests | Avg (ms) | p95 (ms) | Max (ms) | HTTP errors | SPA 404 (expected) | Aborted |');
    out.push('|---|---|---|---|---|---|---|---|');
    out.push(`| ${rows.length} | ${total.requestCount} | ${total.avgMs} | ${total.p95Ms}${flag(total.p95Ms, P95_BUDGET_MS)} | ${total.maxMs}${flag(total.maxMs, SLOW_REQUEST_MS)} | ${total.failedCount} | ${total.spaFallbackCount} | ${total.abortedCount} |\n`);

    out.push('## By browser\n');
    out.push('| Project | Requests | Avg (ms) | p95 (ms) | Max (ms) | HTTP errors | Aborted |');
    out.push('|---|---|---|---|---|---|---|');
    for (const project of [...new Set(rows.map((r) => r.project))]) {
      const s = summarize(rows.filter((r) => r.project === project).flatMap((r) => r.net.requests));
      out.push(`| ${project} | ${s.requestCount} | ${s.avgMs} | ${s.p95Ms}${flag(s.p95Ms, P95_BUDGET_MS)} | ${s.maxMs} | ${s.failedCount} | ${s.abortedCount} |`);
    }

    out.push('\n## Top 10 slowest requests\n');
    out.push('| Method | Path | Type | Status | TTFB (ms) | Total (ms) |');
    out.push('|---|---|---|---|---|---|');
    const slowest: RequestMetric[] = [...all].sort((a, b) => b.durationMs - a.durationMs).slice(0, 10);
    for (const r of slowest) {
      out.push(`| ${r.method} | ${pathOf(r.url)} | ${r.resourceType} | ${r.status ?? 'aborted'} | ${r.ttfbMs ?? '-'} | ${r.durationMs}${flag(r.durationMs, SLOW_REQUEST_MS)} |`);
    }

    out.push('\n## Per test\n');
    out.push('| Test | Project | Result | Test time (ms) | Requests | Avg (ms) | p95 (ms) | Max (ms) | HTTP errors | SPA 404 | Aborted |');
    out.push('|---|---|---|---|---|---|---|---|---|---|---|');
    for (const r of rows) {
      out.push(`| ${r.title} | ${r.project} | ${r.status} | ${r.testMs} | ${r.net.requestCount} | ${r.net.avgMs} | ${r.net.p95Ms}${flag(r.net.p95Ms, P95_BUDGET_MS)} | ${r.net.maxMs}${flag(r.net.maxMs, SLOW_REQUEST_MS)} | ${r.net.failedCount} | ${r.net.spaFallbackCount} | ${r.net.abortedCount} |`);
    }
    return out.join('\n') + '\n';
  }
}