import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "✅ Connected to MongoDB" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "❌ Connection failed", error: String(error) },
      { status: 500 }
    );
  }
}