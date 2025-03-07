"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Edit, Play, CheckCircle } from "lucide-react"
import type { Task } from "@/lib/types"
import { updateTaskStatus } from "@/lib/tasks"

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  isOwner: boolean
}

export default function TaskList({ tasks, isLoading, isOwner }: TaskListProps) {
  const [error, setError] = useState("")

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus)
      // Directly update tasks in the parent
      setError("")
    } catch (err: any) {
      console.error("Failed to update task status:", err)
      setError(err.message || "Failed to update task status. Please try again.")
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
    return <div className="text-center py-4">Loading tasks...</div>
  }

  if (error) {
    return <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>
  }

  if (tasks.length === 0) {
    return <div className="text-center py-4">No tasks found.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>{task.customerName}</TableCell>
              <TableCell>{task.assigneeName || "Unassigned"}</TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/tasks/${task.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </Link>
                    </DropdownMenuItem>
                    {isOwner && (
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/tasks/${task.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit task
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {task.status === "new" && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(task.id, "in-progress")}>
                        <Play className="mr-2 h-4 w-4" />
                        Start work
                      </DropdownMenuItem>
                    )}
                    {task.status === "in-progress" && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(task.id, "done")}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as completed
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}