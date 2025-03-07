"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import TaskList from "@/components/tasks/task-list"
import Header from "@/components/header"
import { getTasks } from "@/lib/tasks"
import { getCurrentUser } from "@/lib/auth"
import type { Task } from "@/lib/types"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [user,setUser] = useState({role:"nothing",id:"nothing",email:"nothing",name:"nothing"})

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, userData] = await Promise.all([getTasks(), getCurrentUser()])
        setUser(userData)
        setTasks(tasksData)
        setIsOwner(userData?.role === "owner")
      } catch (error) {
        console.error("Failed to load tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const newTasks = tasks.filter((task) => task.status === "new")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "done")

  return (
    <>
    <Header user={user}/>
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Tasks</h1>
        {isOwner && (
          <Link href="/dashboard/tasks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="done">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <TaskList tasks={tasks} isLoading={isLoading} isOwner={isOwner} />
        </TabsContent>
        <TabsContent value="new" className="space-y-4">
          <TaskList tasks={newTasks} isLoading={isLoading} isOwner={isOwner} />
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          <TaskList tasks={inProgressTasks} isLoading={isLoading} isOwner={isOwner} />
        </TabsContent>
        <TabsContent value="done" className="space-y-4">
          <TaskList tasks={completedTasks} isLoading={isLoading} isOwner={isOwner} />
        </TabsContent>
      </Tabs>
    </div>
    </>
  )
}

