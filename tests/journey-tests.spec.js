const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');
const { generateToken } = require('../utils/auth');

// Helper function to calculate Blackjack score
function calculateBlackjackScore(cards) {
  let sum = 0;
  let aceCount = 0;

  for (const card of cards) {
    const value = card.value;
    if (value === 'ACE') {
      aceCount = 1;
      sum += 11;
    } else if (['KING', 'QUEEN', 'JACK'].includes(value)) {
      sum += 10;
    } else {
      sum += parseInt(value) || 0; // Handle numeric values
    }
  }

  if (aceCount === 1 && sum > 21) {
    sum -= 10;
  }

  return sum;
}

test.describe('Blackjack Game Journey Tests', () => {
  const baseUrl = process.env.HOST_URL || 'https://deckofcardsapi.com';
  const authUrl = process.env.AUTH_URL || `${baseUrl}/login`;
  let deckId;
  let users;
  let isWebsiteUp;

  test.beforeAll(async ({ request }) => {
    // Check if the website is up
    try {
      const response = await request.get(`${baseUrl}/api/deck/new/`);
      isWebsiteUp = response.ok();
      if (!isWebsiteUp) {
        console.log(`Website ${baseUrl} is down, skipping tests`);
      }
    } catch (error) {
      isWebsiteUp = false;
      console.log(`Website ${baseUrl} is down, error: ${error.message}, skipping tests`);
    }

    // Load user data
    if (isWebsiteUp) {
      const usersData = await fs.readFile(path.join(__dirname, '../data/users.json'));
      users = JSON.parse(usersData).users;
    }
  });

  test('J1: Create New Deck', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);

    const response = await request.post(`${baseUrl}/api/deck/new/`);

    // Test: Successful POST request (200 or 201)
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThanOrEqual(201);

    // Test: Response time is less than 200ms
    expect(response.ok()).toBeTruthy();
    const responseTime = response.timing ? response.timing.responseEnd : 0;
    expect(responseTime).toBeLessThan(200);

    // Test: Verify response body
    const jsonData = await response.json();
    deckId = jsonData.deck_id;
    process.env.DECK_ID = deckId; // Store for subsequent tests
    expect(jsonData.success).toBe(true);
    expect(jsonData.deck_id).not.toBeNull();
    expect(jsonData.remaining).toBe(52);
    expect(jsonData.shuffled).toBe(false);
  });

  test('J2: Shuffle Deck', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);
    test.skip(!deckId, 'No deck_id available from previous test');

    const response = await request.get(`${baseUrl}/api/deck/${deckId}/shuffle?deck_count=6`);

    // Test: Status code is 200
    expect(response.status()).toBe(200);

    // Test: Response time is less than 200ms
    expect(response.ok()).toBeTruthy();
    const responseTime = response.timing ? response.timing.responseEnd : 0;
    expect(responseTime).toBeLessThan(200);

    // Test: Verify response body
    const jsonData = await response.json();
    expect(jsonData.success).toBe(true);
    expect(jsonData.deck_id).toBe(deckId);
    expect(jsonData.remaining).toBe(52);
    expect(jsonData.shuffled).toBe(true);
  });

  test('J3: Draw 3 Cards for Player 1', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);
    test.skip(!deckId, 'No deck_id available from previous test');
    test.skip(!users, 'No user data available');

    const user = users.find(u => u.id === 'user1');
    const password = process.env.USER1_PASSWORD;
    test.skip(!password, 'No password available for user1');

    const token = await generateToken(user.email, password, authUrl);
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await request.get(`${baseUrl}/api/deck/${deckId}/draw/?count=3`, { headers });

    // Test: Status code is 200
    expect(response.status()).toBe(200);

    // Test: Response time is less than 200ms
    expect(response.ok()).toBeTruthy();
    const responseTime = response.timing ? response.timing.responseEnd : 0;
    expect(responseTime).toBeLessThan(200);

    // Test: Verify response body
    const jsonData = await response.json();
    expect(jsonData.success).toBe(true);
    expect(jsonData.deck_id).toBe(deckId);
    expect(jsonData.cards).toBeInstanceOf(Array);
    expect(jsonData.cards).toHaveLength(3);
    expect(jsonData.remaining).toBe(49);

    // Calculate Blackjack score
    const score = calculateBlackjackScore(jsonData.cards);
    console.log(`Player 1 cards: ${JSON.stringify(jsonData.cards)}`);
    console.log(`Player 1 score: ${score}`);
    console.log(score === 21 ? 'Player 1 won the Black Jack' : 'Player 1 did not win Black Jack');
  });

  test('J4: Draw 3 Cards for Player 2', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);
    test.skip(!deckId, 'No deck_id available from previous test');
    test.skip(!users, 'No user data available');

    const user = users.find(u => u.id === 'user2');
    const password = process.env.USER2_PASSWORD;
    test.skip(!password, 'No password available for user2');

    const token = await generateToken(user.email, password, authUrl);
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await request.get(`${baseUrl}/api/deck/${deckId}/draw/?count=3`, { headers });

    // Test: Status code is 200
    expect(response.status()).toBe(200);

    // Test: Response time is less than 200ms
    expect(response.ok()).toBeTruthy();
    const responseTime = response.timing ? response.timing.responseEnd : 0;
    expect(responseTime).toBeLessThan(200);

    // Test: Verify response body
    const jsonData = await response.json();
    expect(jsonData.success).toBe(true);
    expect(jsonData.deck_id).toBe(deckId);
    expect(jsonData.cards).toBeInstanceOf(Array);
    expect(jsonData.cards).toHaveLength(3);
    expect(jsonData.remaining).toBe(46);

    // Calculate Blackjack score
    const score = calculateBlackjackScore(jsonData.cards);
    console.log(`Player 2 cards: ${JSON.stringify(jsonData.cards)}`);
    console.log(`Player 2 score: ${score}`);
    console.log(score === 21 ? 'Player 2 won the Black Jack' : 'Player 2 did not win Black Jack');
  });
});
