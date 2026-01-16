import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import TaskSubmission from "@/models/TaskSubmission";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// 🔐 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "multipart/form-data required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const userId = formData.get("user");
    const task = formData.get("task");
    const reviewLink = formData.get("reviewLink");
    const file = formData.get("screenshot");

    if (!task || !userId || !file) {
      return NextResponse.json(
        { success: false, message: "Task, User & Screenshot are required" },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(task) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid task or user ID" },
        { status: 400 }
      );
    }

    // 🖼️ Convert file → buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ☁️ Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "task-submissions",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 🌐 Cloudinary URL
    const screenshotUrl = uploadResult.secure_url;

    // 🧾 Save submission
    const submission = await TaskSubmission.create({
      task,
      user: new mongoose.Types.ObjectId(userId),
      proof: {
        screenshotUrl,
        reviewLink,
      },
      status: "pending",
      submittedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, data: submission },
      { status: 201 }
    );

  } catch (error) {
    console.error("Task submission error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ✅ GET ALL TASKS */
export async function GET() {
  try {
    await connectDB();
    const tasks = await TaskSubmission.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
