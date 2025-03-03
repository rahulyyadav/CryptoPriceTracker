---
id: crypto-price-tracker
slug: /
title: Crypto Price Tracker Documentation
---

# Crypto Price Tracker Documentation

## Project Setup Guide

To run the web app, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the project directory:**
   ```bash
   cd crypto_price_tracker
   ```
3. **Install the dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Open the app in your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the app.

## API Integration Details

The app uses the CoinGecko API to fetch live cryptocurrency prices. The API endpoint used is:

```
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,solana&vs_currencies=usd
```

This endpoint provides the latest prices for Bitcoin, Ethereum, Ripple, Cardano, and Solana in USD. The data is fetched using a simple `fetch` request and is updated when the user clicks the "Refresh" button.

## State Management Explanation

Zustand is used for state management in this project. It was chosen for its simplicity and ease of use. Zustand allows us to manage the app's state without the boilerplate of other state management libraries. It handles the search input, loading state, and fetched data.

## Challenges & Solutions

### Challenge: React Version Compatibility

Initially, there was a compatibility issue with `react-query` and React 19.0.0. To resolve this, we switched to Zustand for state management, which is compatible with the current React version.

### Solution: Zustand Implementation

Zustand was implemented to manage the app's state, handling data fetching, loading states, and error management efficiently. This allowed us to maintain a clean and efficient codebase while ensuring compatibility with the latest React version.
