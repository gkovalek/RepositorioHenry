import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task } from '../types/task'

const tasksCol = (userId: string) =>
  collection(db, 'users', userId, 'tasks')

export async function createTask(
  userId: string,
  title: string,
  description: string,
): Promise<void> {
  await addDoc(tasksCol(userId), {
    userId,
    title,
    description,
    completed: false,
    createdAt: serverTimestamp(),
  })
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: Partial<Pick<Task, 'title' | 'description' | 'completed'>>,
): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'tasks', taskId), data)
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'tasks', taskId))
}

export async function toggleComplete(
  userId: string,
  taskId: string,
  completed: boolean,
): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'tasks', taskId), { completed })
}
