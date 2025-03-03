"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { getHistoricalData, formatDate } from "../utils";

interface CryptoDetailProps {
  cryptoId: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
  onClose: () => void;
}

export default function CryptoDetail({
  cryptoId,
  name,
  symbol,
  currentPrice,
  priceChange24h,
  marketCap,
  volume,
  onClose,
}: CryptoDetailProps) {
  const [historicalData, setHistoricalData] = useState<
    { timestamp: number; price: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistoricalData() {
      setIsLoading(true);
      try {
        const data = await getHistoricalData(cryptoId);
        setHistoricalData(data);
      } catch (error) {
        console.error("Error loading historical data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHistoricalData();
  }, [cryptoId]);

  const chartData = {
    labels: historicalData.map((data) => formatDate(data.timestamp)),
    datasets: [
      {
        label: `${name} Price (USD)`,
        data: historicalData.map((data) => data.price),
        borderColor:
          priceChange24h >= 0 ? "rgb(75, 192, 192)" : "rgb(255, 99, 132)",
        backgroundColor:
          priceChange24h >= 0
            ? "rgba(75, 192, 192, 0.2)"
            : "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${name} Price History`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `$${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  // Format numbers for display
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              {name} <span className="ml-2 text-gray-400">({symbol})</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Current Price</div>
              <div className="text-2xl font-bold">
                ${currentPrice.toLocaleString()}
              </div>
              <div
                className={`text-sm ${
                  priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {priceChange24h >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(priceChange24h).toFixed(2)}% (24h)
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Market Cap</div>
              <div className="text-2xl font-bold">
                {formatNumber(marketCap)}
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">24h Trading Volume</div>
              <div className="text-2xl font-bold">{formatNumber(volume)}</div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Historical Data Points</div>
              <div className="text-2xl font-bold">{historicalData.length}</div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Price History</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-blue-400">Loading historical data...</div>
              </div>
            ) : historicalData.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                No historical data available yet. Data will be collected as
                prices are updated.
              </div>
            ) : (
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
