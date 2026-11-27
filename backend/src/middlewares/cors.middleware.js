import cors from 'cors';
import env from '../config/env.js';

/**
 * Baseline security headers middleware
 */
export function securityHeadersMiddleware(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

/**
 * Check if the incoming request origin is permitted
 */
function isOriginAllowed(origin) {
  // Allow non-browser requests (e.g., Postman, curl, server-side fetch, mobile app)
  if (!origin) return true;

  try {
    const parsed = new URL(origin);
    const host = parsed.hostname.toLowerCase();

    // Explicitly allowed in configuration
    if (env.allowedOrigins && env.allowedOrigins.includes(origin)) {
      return true;
    }

    // Allow any azzunique.in domain or subdomain (crm.azzunique.in, www.crm.azzunique.in, etc.)
    if (host === 'azzunique.in' || host.endsWith('.azzunique.in')) {
      return true;
    }

    // Allow local development hosts
    if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') {
      return true;
    }

    // Allow LAN IP ranges for local network testing across multiple devices (192.168.x, 10.x, 172.16-31.x)
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host)) {
      return true;
    }
  } catch {
    // If not a parseable URL, fall back to checking if it is explicitly listed
    if (env.allowedOrigins && env.allowedOrigins.includes(origin)) {
      return true;
    }
  }

  return false;
}

/**
 * Dynamic CORS configuration based on validated allowed origins
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      // Standard CORS policy: return false so browser rejects the origin gracefully,
      // without throwing an unhandled Express 500 error that terminates the connection.
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'Pragma',
    'X-Company-ID',
    'X-Client-ID',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // Cache preflight requests for 24 hours to eliminate latency on other devices
  optionsSuccessStatus: 200,
});

export default { securityHeadersMiddleware, corsMiddleware };

