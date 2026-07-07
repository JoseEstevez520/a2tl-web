# API Health Dashboard

*Real-time monitoring — Last 24 hours*

## Key Metrics

| Metric | Value | Note |
|--------|-------|------|
| **Uptime** | 99.97% | SLA: 99.9% |
| **Avg Latency** | 45ms | P99: 210ms |
| **Error Rate** | 0.12% | < 0.5% target |
| **Requests** | 2.8M | 24h total |

## Response Time (ms)

| Time | P50 | P95 | P99 |
|------|-----|-----|-----|
| 00:00 | 32 | 85 | 120 |
| 04:00 | 28 | 72 | 105 |
| 08:00 | 42 | 110 | 180 |
| 12:00 | 55 | 145 | 250 |
| 16:00 | 48 | 120 | 195 |
| 20:00 | 38 | 95 | 140 |
| 24:00 | 35 | 88 | 130 |

## Requests by Endpoint

| Endpoint | Requests |
|----------|----------|
| /api/users | 820,000 |
| /api/orders | 650,000 |
| /api/products | 540,000 |
| /api/auth | 480,000 |
| /api/search | 310,000 |

## Error Breakdown

- **Timeout (504)** — 38%
- **Bad Request (400)** — 25%
- **Not Found (404)** — 20%
- **Server Error (500)** — 12%
- **Rate Limited (429)** — 5%

## Recent Incidents

| Time | Endpoint | Status | Duration | Resolution |
|------|----------|--------|----------|------------|
| 14:23 | /api/search | 504 | 3m 12s | Auto-recovered |
| 09:15 | /api/orders | 500 | 45s | Hotfix deployed |
| 02:41 | /api/auth | 429 | 8m | Rate limit adjusted |

> **Insight:** The 14:23 timeout spike correlates with a database connection pool exhaustion. Auto-scaling resolved it within 3 minutes.

## Action Items

- Increase connection pool size from 20 to 50
- Add circuit breaker to /api/search
- Set up PagerDuty alert for P99 > 300ms
