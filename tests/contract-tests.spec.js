const { test, expect } = require('@playwright/test');

test.describe('Blackjack API Contract Tests', () => {
  const baseUrl = process.env.HOST_URL || 'https://deckofcardsapi.com';
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
  });

  test('C1: Deck + Draw 2 Cards - 200', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);

    const response = await request.get(`${baseUrl}/api/deck/new/draw/?count=2`);

    expect(response.status()).toBe(200);
    const jsonData = await response.json();
    expect(jsonData.success).toBe(true);
    expect(jsonData.cards).toBeInstanceOf(Array);
    expect(jsonData.cards).toHaveLength(2);
    expect(jsonData.deck_id).not.toBeNull();
    expect(jsonData.remaining).toBe(50);
  });

  test('C2: Deck ID Not Found - 404', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);

    const response = await request.get(`${baseUrl}/api/deck/djcjdvvdvvd/draw/?count=2`);

    expect(response.status()).toBe(404);
  });

  test('C3: Invalid Resource Name - 404', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);

    const response = await request.get(`${baseUrl}/api/decks/new/draw/?count=2`);

    expect(response.status()).toBe(404);
  });

  test('C4: Count More Than Cards Available', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);

    const response = await request.get(`${baseUrl}/api/deck/new/draw/?count=98`);

    expect(response.status()).toBe(200); // deckofcardsapi.com returns 200 with remaining cards
    const jsonData = await response.json();
    expect(jsonData.success).toBe(true);
    expect(jsonData.cards).toBeInstanceOf(Array);
    expect(jsonData.cards.length).toBeLessThanOrEqual(52); // Should return max available cards
  });

  test('C5: Invalid Host', async ({ request }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);

    const response = await request.get('https://deckofcardapi.com/api/deck/new/draw/?count=2');

    expect(response.status()).toBeGreaterThanOrEqual(400); // Expect client or server error
  });
});
