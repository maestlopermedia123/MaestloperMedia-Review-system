export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import User from '@/models/User';
import cloudinary from '@/utils/cloudinary';

export async function PUT(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('qr');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file → buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'upi_qr_codes' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.upiQr = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };

    await user.save();

    return NextResponse.json({
      message: 'QR uploaded successfully',
      upiQr: user.upiQr,
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
