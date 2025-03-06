"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Client-side redirect
import { getCurrentUser } from "@/lib/auth";
import OwnerDashboard from "@/components/dashboard/owner-dashboard";
import WorkerDashboard from "@/components/dashboard/worker-dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Start with `null` to indicate loading

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };

    fetchData();
  }, []);

  // Show a loading state while user data is being fetched
  if (user === null) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // Redirect to login if user is not authenticated
  if (user.role === "nothing") {
    router.push("/login");
    return null; // Prevent rendering anything else
  }

  return (
    <div className="flex min-h-screen flex-col">
      {user.role === "owner" ? (
        <OwnerDashboard user={user} />
      ) : (
        <WorkerDashboard user={user} />
      )}
    </div>
  );
}