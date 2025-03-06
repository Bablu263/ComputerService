"use client"

import { v4 as uuidv4 } from "uuid"
import type { User, CreateUserInput } from "./types"

// Mock data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "owner@example.com",
    password: "password",
    role: "owner",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "worker@example.com",
    password: "password",
    role: "worker",
  },
]

// In a real app, these would be API calls to a backend
export async function getAllUsers(): Promise<User[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Load from localStorage if available
  const usersJson = localStorage.getItem("users")
  if (usersJson) {
    const users = JSON.parse(usersJson)
    // Remove password from user objects
    return users.map((user: any) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  }

  // Otherwise use mock data and save to localStorage
  localStorage.setItem("users", JSON.stringify(MOCK_USERS))

  // Return users without passwords
  return MOCK_USERS.map((user) => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })
}

export async function createUser(userInput: CreateUserInput): Promise<User> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Check if email already exists
  const users = await getAllUsersWithPasswords()
  if (users.some((u) => u.email.toLowerCase() === userInput.email.toLowerCase())) {
    throw new Error("Email already in use")
  }

  const newUser = {
    id: uuidv4(),
    ...userInput,
  }

  // Update localStorage
  const updatedUsers = [...users, newUser]
  localStorage.setItem("users", JSON.stringify(updatedUsers))

  // Return user without password
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export async function deleteUser(userId: string): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const users = await getAllUsersWithPasswords()

  // Check if this is the last owner
  const userToDelete = users.find((u) => u.id === userId)
  if (userToDelete?.role === "owner" && users.filter((u) => u.role === "owner").length <= 1) {
    throw new Error("Cannot delete the last owner account")
  }

  const updatedUsers = users.filter((user) => user.id !== userId)
  localStorage.setItem("users", JSON.stringify(updatedUsers))
}

// Helper function to get users with passwords (for internal use only)
async function getAllUsersWithPasswords(): Promise<any[]> {
  // Load from localStorage if available
  const usersJson = localStorage.getItem("users")
  if (usersJson) {
    return JSON.parse(usersJson)
  }

  // Otherwise use mock data and save to localStorage
  localStorage.setItem("users", JSON.stringify(MOCK_USERS))
  return MOCK_USERS
}

