import { connectDB } from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken(user);

  const res = NextResponse.json({
    message: 'Login successful',
    user: { id: user._id, email: user.email, role: user.role },
  });

  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
