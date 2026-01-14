import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import { connectDB } from '@/utils/db';
import User from '@/models/User';

export async function GET(req) {
  await connectDB();

  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyToken(token); // should include role
    const user = await User.findById(payload.id).select('-password'); // exclude password

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user }); // ✅ user object
  } catch (error) {
    console.error('ME API ERROR:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
