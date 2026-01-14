
import { connectDB } from "@/utils/db";
import Tasks from "@/models/Tasks";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded?.id;
    if (!userId) {
      return Response.json({ success: false, message: "Invalid user ID" }, { status: 401 });
    }

    // UPDATED QUERY: 
    // This finds any task where the userId exists within the assignedUsers array.
    const tasks = await Tasks.find({
      assignedUsers: userId 
    })
    .populate("assignedUsers", "name email role")
    .sort({ createdAt: -1 });
    // console.log("Tasks fetched for user:", userId, tasks);
    return Response.json(
      { success: true, count: tasks.length, data: tasks },
      { status: 200 }
    );

  } catch (error) {
    console.error("Fetch Error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}