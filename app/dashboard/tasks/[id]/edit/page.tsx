"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getTaskById, updateTask } from "@/lib/tasks"
import { getAllUsers } from "@/lib/users"
import type { Task, User } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface EditTaskPageProps {
  params: {
    id: string
  }
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [itemsReceived, setItemsReceived] = useState("")
  const [assigneeId, setAssigneeId] = useState("")
  const [workers, setWorkers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        // First try to get users
        const users = await getAllUsers()
        setWorkers(users.filter((user) => user.role === "worker"))

        // Then try to get the task data
        const taskData = await getTaskById(params.id)
        setTask(taskData)
        setTitle(taskData.title)
        setDescription(taskData.description)
        setCustomerName(taskData.customerName)
        setCustomerPhone(taskData.customerPhone)
        setCustomerEmail(taskData.customerEmail || "")
        setItemsReceived(taskData.itemsReceived)
        setAssigneeId(taskData.assigneeId || "unassigned")
      } catch (err: any) {
        console.error("Failed to load data:", err)
        setError(err.message || "Failed to load task data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await updateTask(params.id, {
        title,
        description,
        customerName,
        customerPhone,
        customerEmail,
        itemsReceived,
        assigneeId: assigneeId === "unassigned" ? null : assigneeId,
        status: task?.status || "new",
      })

      router.push(`/dashboard/tasks/${params.id}`)
    } catch (err: any) {
      console.error("Failed to update task:", err)
      setError(err.message || "Failed to update task. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <p>Loading task data...</p>
        </div>
      </div>
    )
  }

  if (error && !task) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/tasks")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Repair Task</CardTitle>
          <CardDescription>Update the details of this repair task.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && <div className="bg-destructive/15 text-destructive text-sm p-2 rounded-md">{error}</div>}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Task Information</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Laptop Screen Repair"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue and any specific requirements"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="items-received">Items Received</Label>
                <Textarea
                  id="items-received"
                  value={itemsReceived}
                  onChange={(e) => setItemsReceived(e.target.value)}
                  placeholder="List all items received from the customer"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Assign To</Label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select a technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Information</h3>

              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone Number</Label>
                  <Input
                    id="customer-phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

