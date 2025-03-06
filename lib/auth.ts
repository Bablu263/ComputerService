"use client"

import type { User } from "./types"

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

// In a real app, this would be handled by a proper authentication system
export async function loginUser(email: string, password: string): Promise<boolean> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

  if (user) {
    // Store user in localStorage for demo purposes
    // In a real app, this would be handled by cookies/JWT
    const { password, ...userWithoutPassword } = user
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
    return true
  }

  return false
}

export async function logoutUser(): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  localStorage.removeItem("currentUser")
}

export async function getCurrentUser(): Promise<User | {role:"nothing",id:"nothing",email:"nothing",name:"nothing"} > {
  // In a real app, this would validate the session/token
  const userJson = localStorage.getItem("currentUser")

  if (!userJson) {
    return {role:"nothing",id:"nothing",email:"nothing",name:"nothing"}
  }

  return JSON.parse(userJson) as User
}

