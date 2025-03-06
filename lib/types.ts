export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string
  itemsReceived: string
  assigneeId: string | null
  assigneeName: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description: string
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string
  itemsReceived: string
  assigneeId: string | null
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: string
}

