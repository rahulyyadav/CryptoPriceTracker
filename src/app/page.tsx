"use client";

import { create } from "zustand";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import CryptoDetail from "./components/CryptoDetail";
import { updateCryptoPrice } from "./utils";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  total_volume: number;
  sparkline_in_7d: {
    price: number[];
  };
}

interface StoreState {
  search: string;
  setSearch: (search: string) => void;
  data: CryptoData[] | null;
  setData: (data: CryptoData[] | null) => void;
  previousData: Record<string, number> | null;
  setPreviousData: (data: Record<string, number> | null) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  search: "",
  setSearch: (search: string) => set({ search }),
  data: null,
  setData: (data: CryptoData[] | null) => set({ data }),
  previousData: null,
  setPreviousData: (previousData: Record<string, number> | null) =>
    set({ previousData }),
  error: null,
  setError: (error: Error | null) => set({ error }),
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

function fetchCryptoPrices() {
  return fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,cardano,solana&order=market_cap_desc&per_page=5&page=1&sparkline=true&price_change_percentage=24h,7d"
  ).then((response) => response.json());
}

function Dashboard() {
  const {
    search,
    setSearch,
    data,
    setData,
    previousData,
    setPreviousData,
    error,
    setError,
    isLoading,
    setLoading,
  } = useStore();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Store previous prices for comparison
      if (data) {
        const prevPrices: Record<string, number> = {};
        data.forEach((crypto) => {
          prevPrices[crypto.id] = crypto.current_price;
        });
        setPreviousData(prevPrices);
      }

      const result = await fetchCryptoPrices();
      setData(result);

      // Store price data in JSON file
      if (result && Array.isArray(result)) {
        result.forEach((crypto) => {
          updateCryptoPrice(crypto.id, crypto.current_price).catch(
            console.error
          );
        });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredData = data
    ? data.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(search.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Function to determine price change indicator
  const getPriceChangeIndicator = (id: string, currentPrice: number) => {
    if (!previousData || !previousData[id]) return null;

    if (currentPrice > previousData[id]) {
      return <span className="text-green-500">↑</span>;
    } else if (currentPrice < previousData[id]) {
      return <span className="text-red-500">↓</span>;
    }
    return <span className="text-gray-400">→</span>;
  };

  // Function to format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Crypto Price Tracker</h1>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 sm:mb-0 sm:mr-3 p-3 w-full sm:w-64 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          onClick={fetchData}
          className="p-3 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 transition-all duration-300 ease-in-out"
        >
          Refresh
        </button>
      </div>
      {isLoading && !data ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">Error fetching data</p>
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Coin</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">24h %</th>
                <th className="px-4 py-3 text-right">7d %</th>
                <th className="px-4 py-3 text-right">Market Cap</th>
                <th className="px-4 py-3 text-right">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((crypto) => (
                <tr
                  key={crypto.id}
                  className="border-t border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedCrypto(crypto)}
                >
                  <td className="px-4 py-3">{crypto.market_cap_rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-6 h-6 mr-2"
                      />
                      <span className="font-medium">{crypto.name}</span>
                      <span className="text-gray-400 ml-2">
                        {crypto.symbol.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end">
                      {getPriceChangeIndicator(crypto.id, crypto.current_price)}
                      <span className="ml-1">
                        ${crypto.current_price.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      crypto.price_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      crypto.price_change_percentage_7d_in_currency >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {crypto.price_change_percentage_7d_in_currency?.toFixed(
                      2
                    ) || "0.00"}
                    %
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatNumber(crypto.market_cap)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatNumber(crypto.total_volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isLoading && data && (
        <div className="mt-4 text-blue-400">Refreshing data...</div>
      )}

      {selectedCrypto && (
        <CryptoDetail
          cryptoId={selectedCrypto.id}
          name={selectedCrypto.name}
          symbol={selectedCrypto.symbol}
          currentPrice={selectedCrypto.current_price}
          priceChange24h={selectedCrypto.price_change_percentage_24h}
          marketCap={selectedCrypto.market_cap}
          volume={selectedCrypto.total_volume}
          onClose={() => setSelectedCrypto(null)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return <Dashboard />;
}
