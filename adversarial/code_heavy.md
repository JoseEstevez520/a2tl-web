# EventStream SDK Reference

## Installation

Install via npm or yarn:

```bash
npm install @eventstream/sdk
```

Or with yarn:

```bash
yarn add @eventstream/sdk
```

## Quick Start

Import the client and initialize with your API key:

```typescript
import { EventStream } from '@eventstream/sdk';

const client = new EventStream({
  apiKey: process.env.EVENTSTREAM_API_KEY,
  region: 'us-east-1',
  retries: 3,
});
```

## Authentication

All requests require a valid `apiKey`. You can also use `Bearer` tokens for server-to-server calls. The `Authorization` header must follow the format `Bearer <token>`.

```typescript
// Using API key (recommended for client-side)
const client = new EventStream({ apiKey: 'sk_live_...' });

// Using Bearer token (server-to-server)
const client = new EventStream({
  token: await getServiceToken(),
  baseUrl: 'https://api.eventstream.io/v2',
});
```

## Publishing Events

Use `client.publish()` to send events. Each event requires a `topic`, a `payload` object, and an optional `metadata` map.

```typescript
await client.publish({
  topic: 'user.signup',
  payload: {
    userId: 'usr_8xk2m',
    email: 'alice@example.com',
    plan: 'pro',
    source: 'organic',
  },
  metadata: {
    idempotencyKey: 'idk_abc123',
    priority: 'high',
  },
});
```

### Batch Publishing

For high-throughput scenarios, use `client.publishBatch()`. It accepts up to 1000 events per call and returns a `BatchResult` with per-event status.

```typescript
const result = await client.publishBatch([
  { topic: 'order.created', payload: { orderId: 'ord_1', total: 99.99 } },
  { topic: 'order.created', payload: { orderId: 'ord_2', total: 149.50 } },
  { topic: 'inventory.updated', payload: { sku: 'SKU-100', delta: -2 } },
]);

console.log(`Succeeded: ${result.succeeded}`);
console.log(`Failed: ${result.failed}`);

for (const err of result.errors) {
  console.error(`Event ${err.index}: ${err.message}`);
}
```

## Subscribing to Events

Create a subscription with `client.subscribe()`. The `handler` function receives each event with automatic acknowledgment.

```typescript
const sub = client.subscribe({
  topics: ['user.*', 'order.created'],
  group: 'billing-service',
  handler: async (event) => {
    console.log(`Received ${event.topic}`, event.payload);

    if (event.topic === 'user.signup') {
      await provisionAccount(event.payload.userId);
    }
  },
  onError: (err) => {
    console.error('Subscription error:', err);
  },
});

// Graceful shutdown
process.on('SIGTERM', () => sub.close());
```

## REST API Reference

### POST /v2/events

Publish a single event.

**Request:**

```json
{
  "topic": "user.signup",
  "payload": {
    "userId": "usr_8xk2m",
    "email": "alice@example.com"
  },
  "metadata": {
    "idempotencyKey": "idk_abc123"
  }
}
```

**Response (201):**

```json
{
  "id": "evt_mq93xz",
  "topic": "user.signup",
  "timestamp": "2026-07-07T14:30:00Z",
  "status": "accepted"
}
```

### GET /v2/events/:id

Retrieve an event by ID. Returns `404` if the event has expired past the retention window.

**Response (200):**

```json
{
  "id": "evt_mq93xz",
  "topic": "user.signup",
  "payload": {
    "userId": "usr_8xk2m",
    "email": "alice@example.com"
  },
  "metadata": {
    "idempotencyKey": "idk_abc123"
  },
  "timestamp": "2026-07-07T14:30:00Z",
  "deliveries": 3,
  "lastDeliveredAt": "2026-07-07T14:30:02Z"
}
```

## Error Handling

The SDK throws typed errors. Catch `EventStreamError` for API errors and `NetworkError` for connectivity issues.

```typescript
import { EventStreamError, NetworkError } from '@eventstream/sdk';

try {
  await client.publish({ topic: 'test', payload: {} });
} catch (err) {
  if (err instanceof EventStreamError) {
    console.error(`API error ${err.status}: ${err.code} - ${err.message}`);
    // e.g., 429 RATE_LIMITED - Too many requests
  } else if (err instanceof NetworkError) {
    console.error(`Network error: ${err.message}`);
    // Automatic retry will handle transient failures
  }
}
```

## Configuration Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | — | Your API key |
| `token` | `string` | — | Bearer token (alternative to apiKey) |
| `baseUrl` | `string` | `https://api.eventstream.io/v2` | API base URL |
| `region` | `string` | `us-east-1` | Deployment region |
| `retries` | `number` | `3` | Max retry attempts |
| `timeout` | `number` | `30000` | Request timeout in ms |
| `batchSize` | `number` | `100` | Default batch size |
| `compression` | `boolean` | `true` | Enable gzip compression |

## Rate Limits

The API enforces the following limits per `apiKey`:

- **Publish**: 10,000 events/second
- **Subscribe**: 100 concurrent connections
- **Query**: 1,000 requests/minute

When rate-limited, the SDK automatically backs off using exponential retry with jitter. The `Retry-After` header value is respected.

```typescript
// Custom retry configuration
const client = new EventStream({
  apiKey: 'sk_live_...',
  retries: 5,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
});
```

## CLI Usage

The SDK includes a CLI for debugging:

```bash
# Publish a test event
eventstream publish --topic test.ping --payload '{"ts": 1720000000}'

# Subscribe and print events
eventstream subscribe --topics 'order.*' --group debug

# Check API health
eventstream health --verbose
```

## Docker Example

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
ENV EVENTSTREAM_API_KEY=sk_live_...
CMD ["node", "worker.js"]
```

## Python SDK (Alternative)

A Python SDK is also available:

```python
from eventstream import Client

client = Client(api_key=os.environ["EVENTSTREAM_API_KEY"])

# Publish
client.publish("user.signup", {"user_id": "usr_8xk2m", "email": "alice@example.com"})

# Subscribe
@client.on("order.created")
async def handle_order(event):
    print(f"New order: {event.payload['order_id']}")
    await process_order(event.payload)

client.start()
```
