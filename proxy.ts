import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Just change the name of the function to 'proxy'
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

// Optional: Your matcher config stays the same
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};