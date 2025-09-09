require('dotenv').config({ path: `.env.${process.env.ENV || 'dev'}` });

module.exports = {
  projects: [
    {
      name: 'dev',
      use: {
        baseURL: process.env.HOST_URL || 'https://deckofcardsapi.com',
      },
    },
    {
      name: 'prod',
      use: {
        baseURL: process.env.HOST_URL || 'https://api.production.blackjack.com',
      },
    },
  ],
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
};