import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs'; // Adjust path
import { connectDB } from '@/utils/db';
import TaskSubmission from '@/models/TaskSubmission'; // Adjust path

import mongoose from "mongoose";

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
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const task = formData.get("task");
    const companyname = formData.get("username");
    // console.log('userId:', userId);
    const reviewLink = formData.get("reviewLink");
    const file = formData.get("screenshot");


    // 🔐 Validate required fields
    if (!task || !userIdObjectId || !file) {
      return NextResponse.json(
        { success: false, message: "Task, User & Screenshot are required" },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(task) ||
      !mongoose.Types.ObjectId.isValid(userIdObjectId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid task or user ID" },
        { status: 400 }
      );
    }

    // 📂 Ensure /media folder exists at ROOT
    const mediaDir = path.join(process.cwd(),"public","media");
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    // 🖼️ Save image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const filename = `screenshot-${Date.now()}${ext}`;
    const filePath = path.join(mediaDir, filename);

    await writeFile(filePath, buffer);

    // 🌐 URL stored in DB
    const screenshotUrl = `/media/${filename}`;

    // 🧾 Create DB document (MATCHES MODEL EXACTLY)
    const submission = await TaskSubmission.create({
      task,
      user:userIdObjectId,
      companyname,
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

    return Response.json(
      { success: true, data: tasks },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
