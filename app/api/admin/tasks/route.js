import { connectDB } from "@/utils/db";

import Tasks from "@/models/Tasks";


/* =========================
   GET – Fetch all tasks
========================= */
export async function GET() {
  try {
    await connectDB();

    const tasks = await Tasks.find()
      .populate("assignedUsers", "name email role")
      .sort({ createdAt: -1 });

    return Response.json(
      { success: true, data: tasks },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}


/* =========================
   POST – Create task
========================= */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const task = await Tasks.create(body);

    return Response.json(
      { success: true, message: "Task created", data: task },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to create task" },
      { status: 500 }
    );
  }
}

