// import { connectDB } from '@/utils/db';
// import User from '@/models/User';
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

export async function POST() {
  return Response.json({ success: true, message: "API works" })
}
