import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface HistoricalDataPoint {
  timestamp: number;
  price: number;
}

interface CryptoHistoricalData {
  [key: string]: {
    name: string;
    symbol: string;
    historicalData: HistoricalDataPoint[];
  };
}

const DATA_FILE_PATH = path.join(process.cwd(), "src/app/cryptoPrice.json");

// GET /api/crypto - Get all crypto data
export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading crypto data:", error);
    return NextResponse.json(
      {
        error: "Failed to read crypto data",
      },
      { status: 500 }
    );
  }
}

// POST /api/crypto - Update crypto price
export async function POST(request: NextRequest) {
  try {
    const { id, price } = await request.json();

    if (!id || typeof price !== "number") {
      return NextResponse.json(
        {
          error:
            "Invalid request. Required fields: id (string), price (number)",
        },
        { status: 400 }
      );
    }

    // Read current data
    let data: CryptoHistoricalData;
    try {
      const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
      data = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is invalid, create default structure
      data = {
        bitcoin: { name: "Bitcoin", symbol: "BTC", historicalData: [] },
        ethereum: { name: "Ethereum", symbol: "ETH", historicalData: [] },
        ripple: { name: "XRP", symbol: "XRP", historicalData: [] },
        cardano: { name: "Cardano", symbol: "ADA", historicalData: [] },
        solana: { name: "Solana", symbol: "SOL", historicalData: [] },
      };
    }

    // Update data
    if (data[id]) {
      const historicalData = data[id].historicalData;
      const lastPrice =
        historicalData.length > 0
          ? historicalData[historicalData.length - 1].price
          : null;

      // Only add new price if it's different from the last price (ignoring decimal precision)
      if (lastPrice === null || Math.floor(lastPrice) !== Math.floor(price)) {
        // Add new price data point
        data[id].historicalData.push({
          timestamp: Date.now(),
          price,
        });

        // Keep only the last 30 data points
        if (data[id].historicalData.length > 30) {
          data[id].historicalData = data[id].historicalData.slice(-30);
        }

        // Write updated data back to file
        await fs.writeFile(
          DATA_FILE_PATH,
          JSON.stringify(data, null, 2),
          "utf-8"
        );
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: `Crypto with id '${id}' not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating crypto price:", error);
    return NextResponse.json(
      { error: "Failed to update crypto price" },
      { status: 500 }
    );
  }
}
