import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Transaction from '@/models/Transaction';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const { userId, taskId, taskSubmissionId, amount } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    const transaction = await Transaction.create({
      userId,
      taskId,
      taskSubmissionId,
      amount,
      razorpayOrderId: order.id,
      status: 'created',
    });

    return NextResponse.json({
      success: true,
      order,
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Order creation failed' },
      { status: 500 }
    );
  }
}
