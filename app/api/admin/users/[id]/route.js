export const runtime = "nodejs";

import { connectDB } from "@/utils/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request, context) {
  try {
    await connectDB();

    // ✅ params is ASYNC in latest Next.js
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid User ID" },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
