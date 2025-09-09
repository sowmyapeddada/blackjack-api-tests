const jwt = require('jsonwebtoken');
const { request } = require('@playwright/test');

async function generateToken(email, password, authUrl) {
  try {
    // Attempt to call the real auth endpoint
    const response = await request.newContext().post(authUrl, {
      data: { email, password },
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok()) {
      const jsonData = await response.json();
      return jsonData.token;
    } else {
      console.warn('Auth endpoint failed, generating mock token');
    }
  } catch (error) {
    console.warn('Auth endpoint unavailable, generating mock token:', error.message);
  }

  // Fallback: Generate a mock JWT
  const payload = {
    sub: email.includes('user1') ? 'user1' : 'user2',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'mock-secret');
}

module.exports = { generateToken };
