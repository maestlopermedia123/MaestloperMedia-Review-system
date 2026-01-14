"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // ❌ Not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // ✅ Role based redirect
    if (user.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // 🔄 Full-screen loading UI
  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        {/* Spinner */}
        <div className="h-14 w-14 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        {/* Text */}
        <p className="mt-4 text-sm text-gray-600 tracking-wide">
          Checking authentication…
        </p>
      </div>
    );
  }

  // Prevent flicker after redirect
  return null;
}
