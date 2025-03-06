'use client'

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import OwnerDashboard from "@/components/dashboard/owner-dashboard"
import WorkerDashboard from "@/components/dashboard/worker-dashboard"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {user.role === "owner" ? <OwnerDashboard user={user} /> : <WorkerDashboard user={user} />}
    </div>
  )
}