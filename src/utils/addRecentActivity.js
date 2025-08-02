// utils/addRecentActivity.js
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export default async function addRecentActivity(uid, type, title) {
  if (!uid || !type || !title) return;

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      recentActivity: arrayUnion({
        type,
        title,
        timestamp: Date.now(),
      }),
    });
  } catch (err) {
    console.error("Error adding recent activity:", err);
  }
}
