"use client"

import { v4 as uuidv4 } from "uuid"
import type { Task, CreateTaskInput } from "./types"
import { getCurrentUser } from "./auth"

// Mock data for demo purposes
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Laptop Screen Repair",
    description: "Customer's laptop screen is cracked and needs replacement.",
    status: "new",
    customerName: "Michael Johnson",
    customerEmail: "michael@example.com",
    customerPhone: "(555) 123-4567",
    itemsReceived: "Dell XPS 13 laptop, charger",
    assigneeId: "2",
    assigneeName: "Jane Smith",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    title: "Desktop PC Not Booting",
    description: "Customer's desktop won't turn on. Possible power supply issue.",
    status: "in-progress",
    customerName: "Sarah Williams",
    customerEmail: "sarah@example.com",
    customerPhone: "(555) 987-6543",
    itemsReceived: "Custom built desktop PC, power cable",
    assigneeId: "2",
    assigneeName: "Jane Smith",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    title: "Virus Removal",
    description: "Customer's computer is running slow and showing pop-ups.",
    status: "done",
    customerName: "Robert Brown",
    customerEmail: "robert@example.com",
    customerPhone: "(555) 456-7890",
    itemsReceived: "HP Pavilion laptop, charger",
    assigneeId: "2",
    assigneeName: "Jane Smith",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
  },
]

// In a real app, these would be API calls to a backend
export async function getTasks(): Promise<Task[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Load from localStorage if available
  const tasksJson = localStorage.getItem("tasks")
  if (tasksJson) {
    return JSON.parse(tasksJson) as Task[]
  }

  // Otherwise use mock data and save to localStorage
  localStorage.setItem("tasks", JSON.stringify(MOCK_TASKS))
  return MOCK_TASKS
}

export async function getTasksByAssignee(assigneeId: string): Promise<Task[]> {
  const tasks = await getTasks()
  return tasks.filter((task) => task.assigneeId === assigneeId)
}

// Update the getTaskById function to handle cases where the task isn't found better
export async function getTaskById(taskId: string): Promise<Task> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // First try to get tasks from localStorage
  const tasksJson = localStorage.getItem("tasks")
  let tasks: Task[] = []

  if (tasksJson) {
    tasks = JSON.parse(tasksJson)
  } else {
    // If no tasks in localStorage, use mock data
    tasks = MOCK_TASKS
    // Save mock data to localStorage for future use
    localStorage.setItem("tasks", JSON.stringify(MOCK_TASKS))
  }

  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    throw new Error("Task not found")
  }

  return task
}

export async function createTask(taskInput: CreateTaskInput): Promise<Task> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Get current user for audit
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error("User not authenticated")
  }

  // Get assignee name if assigneeId is provided
  let assigneeName = null
  if (taskInput.assigneeId) {
    // In a real app, this would be a separate API call
    const usersJson = localStorage.getItem("users")
    if (usersJson) {
      const users = JSON.parse(usersJson)
      const assignee = users.find((u: any) => u.id === taskInput.assigneeId)
      if (assignee) {
        assigneeName = assignee.name
      }
    }
  }

  const now = new Date().toISOString()
  const newTask: Task = {
    id: uuidv4(),
    ...taskInput,
    assigneeName,
    createdAt: now,
    updatedAt: now,
  }

  // Update localStorage
  const tasks = await getTasks()
  const updatedTasks = [...tasks, newTask]
  localStorage.setItem("tasks", JSON.stringify(updatedTasks))

  return newTask
}

export async function updateTaskStatus(taskId: string, newStatus: string): Promise<Task> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const tasks = await getTasks()
  const taskIndex = tasks.findIndex((t) => t.id === taskId)

  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  const updatedTask = {
    ...tasks[taskIndex],
    status: newStatus,
    updatedAt: new Date().toISOString(),
  }

  const updatedTasks = [...tasks.slice(0, taskIndex), updatedTask, ...tasks.slice(taskIndex + 1)]

  localStorage.setItem("tasks", JSON.stringify(updatedTasks))

  return updatedTask
}

export async function updateTask(taskId: string, updates: Partial<CreateTaskInput>): Promise<Task> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 700))

  const tasks = await getTasks()
  const taskIndex = tasks.findIndex((t) => t.id === taskId)

  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  // Get assignee name if assigneeId is updated
  let assigneeName = tasks[taskIndex].assigneeName
  if (updates.assigneeId !== undefined && updates.assigneeId !== tasks[taskIndex].assigneeId) {
    if (updates.assigneeId === null) {
      assigneeName = null
    } else {
      // In a real app, this would be a separate API call
      const usersJson = localStorage.getItem("users")
      if (usersJson) {
        const users = JSON.parse(usersJson)
        const assignee = users.find((u: any) => u.id === updates.assigneeId)
        if (assignee) {
          assigneeName = assignee.name
        }
      }
    }
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    assigneeName,
    updatedAt: new Date().toISOString(),
  }

  const updatedTasks = [...tasks.slice(0, taskIndex), updatedTask, ...tasks.slice(taskIndex + 1)]

  localStorage.setItem("tasks", JSON.stringify(updatedTasks))

  return updatedTask
}

