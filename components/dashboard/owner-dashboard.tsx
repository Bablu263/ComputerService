"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import TaskList from "@/components/tasks/task-list"
import { getTasks } from "@/lib/tasks"
import type { Task, User } from "@/lib/types"

interface OwnerDashboardProps {
  user: User
}

export default function OwnerDashboard({ user }: OwnerDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await getTasks()
        setTasks(fetchedTasks)
      } catch (error) {
        console.error("Failed to load tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const newTasks = tasks.filter((task) => task.status === "new")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "done")

  return (
    <>
      <DashboardHeader user={user} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/users">
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/tasks/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  completedTasks.filter((task) => {
                    const today = new Date()
                    const completedDate = new Date(task.updatedAt)
                    return (
                      completedDate.getDate() === today.getDate() &&
                      completedDate.getMonth() === today.getMonth() &&
                      completedDate.getFullYear() === today.getFullYear()
                    )
                  }).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="done">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <TaskList tasks={tasks} isLoading={isLoading} isOwner={true} />
          </TabsContent>
          <TabsContent value="new" className="space-y-4">
            <TaskList tasks={newTasks} isLoading={isLoading} isOwner={true} />
          </TabsContent>
          <TabsContent value="in-progress" className="space-y-4">
            <TaskList tasks={inProgressTasks} isLoading={isLoading} isOwner={true} />
          </TabsContent>
          <TabsContent value="done" className="space-y-4">
            <TaskList tasks={completedTasks} isLoading={isLoading} isOwner={true} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

