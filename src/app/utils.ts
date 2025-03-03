interface HistoricalDataPoint {
  timestamp: number;
  price: number;
}

interface CryptoHistoricalData {
  name: string;
  symbol: string;
  historicalData: HistoricalDataPoint[];
}

export async function updateCryptoPrice(
  id: string,
  price: number
): Promise<void> {
  try {
    await fetch("/api/crypto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, price }),
    });
  } catch (error) {
    console.error("Error updating crypto price:", error);
  }
}

export async function getHistoricalData(
  id: string
): Promise<HistoricalDataPoint[]> {
  try {
    const response = await fetch(`/api/crypto/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch historical data for ${id}`);
    }
    const data: CryptoHistoricalData = await response.json();
    return data.historicalData || [];
  } catch (error) {
    console.error(`Error fetching historical data for ${id}:`, error);
    return [];
  }
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
