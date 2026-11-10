import { type Timestamp } from 'firebase/firestore'

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  completed: boolean
  createdAt: Timestamp
}
