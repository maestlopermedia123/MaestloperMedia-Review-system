import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Transaction from '@/models/Transaction';

export async function POST(req) {
  try {
    await connectDB();

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await req.json();

    const body = razorpayOrderId + '|' + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 }
    );
  }
}
