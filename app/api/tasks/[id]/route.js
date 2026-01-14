import { connectDB } from "@/utils/db";
import Tasks from "@/models/Tasks";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // ✅ UNWRAP params (THIS IS THE FIX)
    const { id } = await params;

    const cleanId = String(id).trim();

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return Response.json(
        { success: false, message: "Invalid Task ID" },
        { status: 400 }
      );
    }

    const task = await Tasks.findById(cleanId);

    if (!task) {
      return Response.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: task },
      { status: 200 }
    );
  } catch (error) {
    console.error("TASK FETCH ERROR:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
