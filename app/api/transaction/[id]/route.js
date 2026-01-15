import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/utils/db";
import Transaction from "@/models/Transaction";

export async function GET(req, context) {
  try {
    await connectDB();

    // ✅ params IS A PROMISE in new Next.js
    const { id: userId } = await context.params;

    console.log("Received userId:", userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId missing" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Mongo ObjectId", userId },
        { status: 400 }
      );
    }

    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      { success: true, data: transactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
