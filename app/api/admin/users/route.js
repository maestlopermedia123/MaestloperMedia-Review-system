
import { connectDB } from '@/utils/db';
import User from '@/models/User';

export async function GET(req) {
    try {
        await connectDB();

        const users = await User.find({ role: 'user' }).select('-password');

        return Response.json(
            { success: true, data: users },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}





