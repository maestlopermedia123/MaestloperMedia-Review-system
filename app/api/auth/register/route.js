// import { connectDB } from '@/utils/db.js';
// import User from '@/models/User.js';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { name, email, password, mobileno } = await req.json();

//     if (!name || !email || !password || !mobileno) {
//       return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
//     }

//     const exists = await User.findOne({ email });
//     if (exists) {
//       return NextResponse.json({ error: 'User already exists' }, { status: 400 });
//     }
    
//     // Explicitly defining the role ensures it is saved even if 
//     // the Mongoose default is behaving unexpectedly.
//     const user = await User.create({ 
//       name, 
//       email, 
//       password,
//       role: 'user', // Explicitly set to ensure it appears in the DB
//       phone: mobileno,
//     });
// console.log('SAVED USER:', user);
//     return NextResponse.json({
//       message: 'User registered',
//       user: { 
//         id: user._id, 
//         name: user.name,
//         email: user.email,
//         role: user.role ,
//         phone: user.phone,
//       },
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }


import { connectDB } from '@/utils/db.js'
import User from '@/models/User.js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    // Debug: check ENV on VPS
    console.log(
      'MONGO_URI:',
      process.env.MONGO_URI ? 'LOADED' : 'MISSING'
    )

    await connectDB()

    const body = await req.json()
    const { name, email, password, mobileno } = body

    // Validate input
    if (!name || !email || !password || !mobileno) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    // Check existing user
    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password (IMPORTANT for security)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      phone: mobileno,
    })

    console.log('SAVED USER:', user._id.toString())

    return NextResponse.json({
      message: 'User registered',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error('Registration Error:', error)

    // Always return JSON (prevents frontend crash)
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal Server Error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
