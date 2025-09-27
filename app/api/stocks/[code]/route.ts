import { defaultStock } from "@/types/stock";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> } 
) {
  const { code } = await context.params;

  try {
    const response = await fetch(
      `https://pasardana.id/api/StockSearchResult/GetAll?Keywords=${code}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `Failed to fetch data for ${code}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    const data = result.length ? result[0] : defaultStock
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
