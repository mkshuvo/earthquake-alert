import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const activeConnections = new Set<ReadableStreamDefaultController<Uint8Array>>();

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller: ReadableStreamDefaultController<Uint8Array>) {
      activeConnections.add(controller);
      
      // Send initial connection message
      controller.enqueue(new TextEncoder().encode('data: {"type":"connected"}\n\n'));
      
      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        if (activeConnections.has(controller)) {
          try {
            controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'));
          } catch (error) {
            clearInterval(heartbeat);
            activeConnections.delete(controller);
          }
        } else {
          clearInterval(heartbeat);
        }
      }, 30000);
    },
    cancel() {
      activeConnections.clear();
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
