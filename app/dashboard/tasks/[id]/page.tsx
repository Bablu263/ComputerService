"use client"

import { use } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Play, CheckCircle } from "lucide-react"
import { getTaskById, updateTaskStatus } from "@/lib/tasks"
import type { Task } from "@/lib/types"
import { getCurrentUser } from "@/lib/auth"
import Header from "@/components/header"

interface TaskDetailPageProps {
  params: {
    id: string
  }
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const {id} = use(params)

  useEffect(() => {
    const loadData = async () => {
      try {
        // First try to get the current user
        const userData = await getCurrentUser()
        setUser(userData)

        // Then try to get the task data
        const taskData = await getTaskById(id)
        setTask(taskData)
      } catch (err: any) {
        console.error("Error loading task:", err)
        setError(err.message || "Failed to load task details")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!task) return

    try {
      await updateTaskStatus(task.id, newStatus)
      setTask({ ...task, status: newStatus })
    } catch (err: any) {
      console.error("Error updating task status:", err)
      setError(err.message || "Failed to update task status")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="outline">New</Badge>
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "done":
        return <Badge variant="default">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <p>Loading task details...</p>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive font-medium">{error || "Task not found"}</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/tasks")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </div>
    )
  }

  const isOwner = user?.role === "owner"
  const canEdit = isOwner
  const canUpdateStatus = task.assigneeId === user?.id || isOwner

  return (
    <>
    <Header user={user}/>
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>Task ID: {task.id}</CardDescription>
              </div>
              <div>{getStatusBadge(task.status)}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-1 text-sm">{task.description}</p>
            </div>
            <div>
              <h3 className="font-medium">Items Received</h3>
              <p className="mt-1 text-sm">{task.itemsReceived}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Created</h3>
                <p className="mt-1 text-sm">{new Date(task.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-medium">Last Updated</h3>
                <p className="mt-1 text-sm">{new Date(task.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Assigned To</h3>
              <p className="mt-1 text-sm">{task.assigneeName || "Unassigned"}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {canEdit && (
              <Button variant="outline" onClick={() => router.push(`/dashboard/tasks/${task.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </Button>
            )}
            {canUpdateStatus && (
              <>
                {task.status === "new" && (
                  <Button onClick={() => handleStatusUpdate("in-progress")}>
                    <Play className="mr-2 h-4 w-4" />
                    Start Work
                  </Button>
                )}
                {task.status === "in-progress" && (
                  <Button onClick={() => handleStatusUpdate("done")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p className="mt-1 text-sm">{task.customerName}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="mt-1 text-sm">{task.customerEmail || "Not provided"}</p>
            </div>
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="mt-1 text-sm">{task.customerPhone}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}

