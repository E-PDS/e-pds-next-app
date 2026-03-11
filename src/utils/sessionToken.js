/**
 * Parse session token from request headers
 * @param {Object} req - The request object
 * @returns {Object} The parsed user object from the session token
 */
export function parseSessionToken(req) {
  return JSON.parse(req.headers['x-session-token']);
}

export default parseSessionToken; 