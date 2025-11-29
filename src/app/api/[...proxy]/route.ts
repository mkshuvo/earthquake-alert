import { NextRequest, NextResponse } from 'next/server';
import http from 'http';
import https from 'https';

// Proxy to backend server via Docker network using service name
const BACKEND_HOST = 'ea-worker';
const BACKEND_PORT = 6000;
const BACKEND_PATH = '/api';

function proxyRequest(backendUrl: string): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(backendUrl);
    const client = url.protocol === 'https:' ? https : http;
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode || 200, data: jsonData });
        } catch {
          resolve({ status: res.statusCode || 200, data });
        }
      });
    });

    req.on('error', (error) => {
      console.error('[API Proxy] Request error:', error.message);
      reject(error);
    });
    req.end();
  });
}

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  
  // Remove /api from the pathname
  const endpoint = pathname.replace('/api', '');
  
  const backendUrl = `http://${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH}${endpoint}?${searchParams.toString()}`;
  console.log(`[API Proxy] Proxying GET to ${backendUrl}`);
  
  try {
    const { status, data } = await proxyRequest(backendUrl);
    return NextResponse.json(data, { 
      status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error: any) {
    console.error(`[API Proxy] Error:`, error.message);
    return NextResponse.json(
      { error: 'Failed to fetch from backend', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const endpoint = pathname.replace('/api', '');
  const backendUrl = `http://${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH}${endpoint}`;
  
  return NextResponse.json(
    { error: 'POST not yet implemented in proxy' },
    { status: 501 }
  );
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
