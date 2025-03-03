---
sidebar_position: 1
---

# Crypto Price Tracker

Welcome to the documentation for the **Crypto Price Tracker** project.

## Overview

The Crypto Price Tracker is a web application built with Next.js that displays live cryptocurrency prices for Bitcoin, Ethereum, Ripple, Cardano, and Solana.

## Features

- **Live Price Updates:** Fetches real-time prices using the CoinGecko API.
- **Search Functionality:** Allows users to filter cryptocurrencies.
- **Responsive Design:** Optimized for both web and mobile devices.

## Getting Started

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

## API Integration

The app uses the CoinGecko API to fetch live cryptocurrency prices. The API endpoint used is:

```
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,solana&vs_currencies=usd
```

## State Management

Zustand is used for state management, chosen for its simplicity and efficiency.

## Challenges & Solutions

### Challenge: React Version Compatibility

Initially, there was a compatibility issue with `react-query` and React 19.0.0. We switched to Zustand for state management, ensuring compatibility with the current React version.

### Solution: Zustand Implementation

Zustand was implemented to manage the app's state, handling data fetching, loading states, and error management efficiently.
