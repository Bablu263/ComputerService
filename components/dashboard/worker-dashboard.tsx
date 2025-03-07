"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import TaskList from "@/components/tasks/task-list"
import { getTasksByAssignee } from "@/lib/tasks"
import type { Task, User } from "@/lib/types"

interface WorkerDashboardProps {
  user: User
}

export default function WorkerDashboard({ user }: WorkerDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await getTasksByAssignee(user.id)
        setTasks(fetchedTasks)
      } catch (error) {
        console.error("Failed to load tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [user.id])

  const newTasks = tasks.filter((task) => task.status === "new")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "done")

  return (
    <>
      <Header user={user} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
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
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
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
            <TaskList tasks={tasks} isLoading={isLoading} isOwner={false} />
          </TabsContent>
          <TabsContent value="new" className="space-y-4">
            <TaskList tasks={newTasks} isLoading={isLoading} isOwner={false} />
          </TabsContent>
          <TabsContent value="in-progress" className="space-y-4">
            <TaskList tasks={inProgressTasks} isLoading={isLoading} isOwner={false} />
          </TabsContent>
          <TabsContent value="done" className="space-y-4">
            <TaskList tasks={completedTasks} isLoading={isLoading} isOwner={false} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

