import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import addRecentActivity from "../utils/addRecentActivity";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  // Fetch user reviews from Firestore
  useEffect(() => {
    if (!user?.uid) return;

    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedReviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const content = form.content.value.trim();

    if (!title || !content || !user?.uid) return;

    try {
      const newReview = {
        userId: user.uid,
        title,
        content,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, "reviews"), newReview);
      await addRecentActivity(user.uid, "reviewed", title);

      form.reset();
      // Re-fetch reviews after adding
      const q = query(
        collection(db, "reviews"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const updatedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-center text-yellow-700 mb-4">
          📝 Your Reviews
        </h1>

        <form onSubmit={handleReviewSubmit} className="space-y-4 mb-8">
          <input
            name="title"
            placeholder="Movie title"
            className="w-full border rounded p-2"
            required
          />
          <textarea
            name="content"
            placeholder="Write your review here..."
            className="w-full border rounded p-2 h-28"
            required
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Submit Review
          </button>
        </form>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">You haven't written any reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-yellow-100 bg-yellow-50 p-4 rounded">
                <h2 className="text-lg font-semibold text-yellow-800">{review.title}</h2>
                <p className="text-gray-700 mt-1">{review.content}</p>
                {review.timestamp?.toDate && (
                  <p className="text-xs text-gray-400 mt-1">
                    {review.timestamp.toDate().toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
