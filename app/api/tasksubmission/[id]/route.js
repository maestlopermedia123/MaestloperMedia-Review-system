import { connectDB } from "@/utils/db";
import TaskSubmission from "@/models/TaskSubmission";
export const runtime = "nodejs";
import mongoose from "mongoose";
/* ✅ GET SINGLE TASK */
export async function GET(req, { params }) {
  try {
    await connectDB();

    const task = await TaskSubmission.findById(params.id);

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
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ✅ UPDATE TASK */
export async function PUT(request, context) {
  try {
    await connectDB();

    // ✅ params is ASYNC in latest Next.js
    const params = await context.params;
    const id = params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid Task ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedTask = await TaskSubmission.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return Response.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ✅ DELETE TASK */
export async function DELETE(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    const id = params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid Task ID" },
        { status: 400 }
      );
    }

    const deletedTask = await TaskSubmission.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return Response.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
