# Blackjack API Tests

This project contains automated API tests for the Blackjack game using the [Deck of Cards API](https://deckofcardsapi.com/) and a hypothetical production API. The tests are written using Playwright and Jest, covering journey tests (user flow) and contract tests (API edge cases). The project includes secure password handling, multiple environment support (`dev` and `prod`), website availability checks, and test case documentation.

## Project Structure


blackjack-api-tests/
├── data/
│   ├── users.json              # User data (emails for authentication)
├── tests/
│   ├── journey-tests.spec.js   # Journey tests for Blackjack game flow
│   ├── contract-tests.spec.js  # Contract tests for API edge cases
├── utils/
│   ├── auth.js                 # Helper for generating auth tokens
├── .env.dev                    # Environment variables for dev
├── .env.prod                   # Environment variables for prod
├── .gitignore                  # Git ignore rules
├── azure-pipelines.yml         # Azure DevOps pipeline configuration
├── jest.config.js              # Jest configuration
├── package.json                # Project dependencies and scripts
├── playwright.config.js        # Playwright configuration
├── test-cases.csv              # Test case documentation
├── README.md                   # This file


## Prerequisites

- **Node.js**: Version 18.x or higher
- **Git**: For version control
- **Visual Studio Code**: Recommended IDE
- **Excel/Google Sheets**: To view `test-cases.csv`

## Setup Instructions

1. **Clone the Repository**:
   
   git clone https://github.com/your-username/blackjack-api-tests.git
   cd blackjack-api-tests
   

2. **Install Dependencies**:
   
   npm install
   

3. **Install Playwright Browsers**:
   
   npx playwright install --with-deps
   

4. **Configure Environment Variables**:
   - Copy `.env.dev` and `.env.prod` to set up environment-specific configurations.
   - Update `.env.prod` with your actual production API URLs and credentials if available.
   - Example `.env.dev`:
     
     HOST_URL=https://deckofcardsapi.com
     AUTH_URL=https://deckofcardsapi.com/login
     USER1_PASSWORD=password123
     USER2_PASSWORD=password456
     JWT_SECRET=mock-secret-value
     

5. **Import Test Cases**:
   - Open `test-cases.csv` in Excel or Google Sheets to view test case documentation.
   - Save as `test-cases.xlsx` if desired.

## Running Tests

Tests are organized into `dev` and `prod` environments, with a website availability check to ensure `HOST_URL` is up before execution.

### Run All Tests

- **Dev Environment**:
  
  npm run test:dev

  Or:
  
  npx playwright test --project=dev
  

- **Prod Environment**:
  
  npm run test:prod
  
  Or:
  
  npx playwright test --project=prod
  

### Run Specific Tests

- **Journey Tests (Dev)**:
  
  npm run test:journey:dev
  

- **Journey Tests (Prod)**:
  
  npm run test:journey:prod
  

- **Contract Tests (Dev)**:
  
  npm run test:contract:dev
  

- **Contract Tests (Prod)**:
  
  npm run test:contract:prod
  

### Website Availability Check

Before running tests, the project checks if the API (`HOST_URL`) is up by sending a `GET` request to `/api/deck/new/`. If the website is down (non-200 status or network error), tests are skipped, and a message is logged:

Website https://deckofcardsapi.com is down, skipping tests


## Test Case Documentation

The `test-cases.csv` file documents all test cases from the Postman collections (`Black Jack Game - Journey Tests` and `Contract Test Example`). Columns include:
- **Test ID**: Unique identifier (e.g., J1, C1)
- **Collection**: Journey or Contract
- **Test Name**: Test description
- **Description**: Purpose of the test
- **Endpoint**: API endpoint
- **Method**: HTTP method
- **Expected Status**: Expected HTTP status code
- **Assertions**: Key assertions
- **Environment**: Dev/prod compatibility

Import `test-cases.csv` into Excel:
1. Open Excel, go to `File > Open`, select `test-cases.csv`.
2. Set delimiter to `Comma` and import.
3. Save as `test-cases.xlsx` if needed.

## Secure Password Handling

- Passwords for User 1 and User 2 are stored in `.env.dev` and `.env.prod` as `USER1_PASSWORD` and `USER2_PASSWORD`.
- The `utils/auth.js` script generates Bearer tokens by calling `AUTH_URL` or creating mock JWTs if the endpoint is unavailable.
- `.env*` files are excluded from Git via `.gitignore` to prevent exposure.

## Multiple Environments

- **Dev**: Uses `https://deckofcardsapi.com` (public API, no real auth required).
- **Prod**: Configured for a hypothetical `https://api.production.blackjack.com` with authentication.
- Set the environment via `ENV=dev` or `ENV=prod` in scripts or use `--project=dev`/`--project=prod` with Playwright.

## Azure DevOps Integration

1. **Create Project**:
   - In Azure DevOps, create a project (e.g., `Blackjack API Tests`).

2. **Add Pipeline**:
   - Go to Pipelines > New Pipeline, select GitHub, and choose `azure-pipelines.yml`.

3. **Set Variables**:
   - Add to pipeline variables:
     - `HOST_URL_DEV`: `https://deckofcardsapi.com`
     - `AUTH_URL_DEV`: `https://deckofcardsapi.com/login`
     - `USER1_PASSWORD_DEV`: `password123`
     - `USER2_PASSWORD_DEV`: `password456`
     - `JWT_SECRET_DEV`: `mock-secret`
     - `HOST_URL_PROD`: `https://api.production.blackjack.com`
     - `AUTH_URL_PROD`: `https://api.production.blackjack.com/login`
     - `USER1_PASSWORD_PROD`: `prod-password123`
     - `USER2_PASSWORD_PROD`: `prod-password456`
     - `JWT_SECRET_PROD`: `prod-mock-secret`
   - Mark password and secret variables as secret.We can also have multiple yaml files per env. as well

4. **Run Pipeline**:
   - Run the pipeline and view JUnit reports in the Tests tab.

## GitHub Integration

1. **Create Repository**:
   - Create a GitHub repository (e.g., `blackjack-api-tests`).

2. **Push Code**:
   
   git remote add origin https://github.com/your-username/blackjack-api-tests.git
   git push -u origin main
   

## Notes

- **Authentication**: Update `.env.prod` with real API credentials if available. Share `/login` endpoint details for tailored auth implementation.
- **Response Time Tests**: Tests check for `< 200ms` response times, which may be unreliable. Consider increasing the threshold or removing these checks.
- **Test Reports**: JUnit reports are generated in `test-results/junit.xml` for Azure DevOps.
- **Website Down Handling**: If `HOST_URL` is down, tests are skipped with a console message, ensuring CI/CD stability.

For issues or additional features, contact the project maintainer or open a GitHub issue.