import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const activityIcons = {
  liked: "⭐",
  reviewed: "📝",
  favorited: "❤️",
  watchlisted: "📺",
};

export default function RecentActivity() {
  const { user } = useAuth();
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const sorted = (data.recentActivity || []).sort((a, b) => b.timestamp - a.timestamp);
          setActivity(sorted.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      }
    };

    fetchActivity();
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Recent Activity</h2>
      <div className="bg-gray-50 p-4 rounded shadow text-sm text-gray-700">
        {activity.length === 0 ? (
          <p>No recent activity yet.</p>
        ) : (
          <ul className="space-y-2">
            {activity.map((item, index) => (
              <li key={index}>
                {activityIcons[item.type] || "🎬"}{" "}
                {capitalize(item.type)} “{item.title}”
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
