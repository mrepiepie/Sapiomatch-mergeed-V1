const rateLimitMap = new Map();
const LIMIT_WINDOW = 60 * 1000; // 1 minute

/**
 * Checks if a given IP has exceeded the limit in the current time window.
 * @param {string} ip - Client IP
 * @param {number} maxRequests - Max permitted requests in window
 * @returns {boolean} true if request is permitted, false if rate-limited
 */
export function checkRateLimit(ip, maxRequests = 10) {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  const timestamps = rateLimitMap.get(ip);
  const validTimestamps = timestamps.filter(t => now - t < LIMIT_WINDOW);
  
  if (validTimestamps.length >= maxRequests) {
    return false;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}
