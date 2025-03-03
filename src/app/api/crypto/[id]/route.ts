import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src/app/cryptoPrice.json");

// GET /api/crypto/:id - Get historical data for a specific crypto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const cryptoData = JSON.parse(data);

    if (cryptoData[id]) {
      return NextResponse.json(cryptoData[id]);
    } else {
      return NextResponse.json(
        { error: `Crypto with id '${id}' not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error reading crypto data:", error);
    return NextResponse.json(
      { error: "Failed to read crypto data" },
      { status: 500 }
    );
  }
}
