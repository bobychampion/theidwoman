import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProgress {
  completedModules: string[];
  completedLessons: string[];
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        completedModules: data.progress?.completedModules || [],
        completedLessons: data.progress?.completedLessons || []
      };
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
  }
  return { completedModules: [], completedLessons: [] };
}

export async function toggleLessonCompletion(userId: string, lessonId: string, isCompleted: boolean) {
  try {
    const userRef = doc(db, "users", userId);
    if (isCompleted) {
      await updateDoc(userRef, {
        "progress.completedLessons": arrayUnion(lessonId),
        updatedAt: new Date().toISOString()
      });
    } else {
      await updateDoc(userRef, {
        "progress.completedLessons": arrayRemove(lessonId),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    throw error;
  }
}

export async function toggleModuleCompletion(userId: string, moduleId: string, isCompleted: boolean) {
  try {
    const userRef = doc(db, "users", userId);
    if (isCompleted) {
      await updateDoc(userRef, {
        "progress.completedModules": arrayUnion(moduleId),
        updatedAt: new Date().toISOString()
      });
    } else {
      await updateDoc(userRef, {
        "progress.completedModules": arrayRemove(moduleId),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
}
