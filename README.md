# Crypto Price Tracker

This project is a simple Crypto Price Tracker built with Next.js. It displays live cryptocurrency prices for Bitcoin, Ethereum, Ripple, Cardano, and Solana.

## Getting Started

To run the web app, follow these steps:

1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## API Integration Details

The app uses the CoinGecko API to fetch live cryptocurrency prices. The API endpoint used is:

```
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,solana&vs_currencies=usd
```

## State Management Explanation

Zustand is used for state management in this project. It was chosen for its simplicity and ease of use. Zustand allows us to manage the app's state without the boilerplate of other state management libraries.

## Challenges & Solutions

### Challenge: React Version Compatibility

Initially, there was a compatibility issue with `react-query` and React 19.0.0. To resolve this, we switched to Zustand for state management, which is compatible with the current React version.

### Solution: Zustand Implementation

Zustand was implemented to manage the app's state, handling data fetching, loading states, and error management efficiently.

##Author
Rahul Yadav
