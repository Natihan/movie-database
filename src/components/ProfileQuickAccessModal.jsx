import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ReviewsPage from "../pages/ReviewsPage";
import LikesPage from "../pages/LikesPage";
import WatchListPage from "../pages/WatchListPage";
import FavoritesPage from "../pages/FavoritesPage";
import SettingsPage from "../pages/SettingsPage";

export default function ProfileQuickAccessModal({ type, isOpen, onClose }) {
  const { user, updateProfilePicture } = useAuth();
  const [newPhotoURL, setNewPhotoURL] = useState("");

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case "reviews":
        return <ReviewsPage />;
      case "likes":
        return <LikesPage />;
      case "watchlist":
        return <WatchListPage />;
      case "favorites":
        return <FavoritesPage />;
      case "settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Change Profile Picture</h3>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter Image URL"
              value={newPhotoURL}
              onChange={(e) => setNewPhotoURL(e.target.value)}
            />
            <button
              onClick={() => {
                if (newPhotoURL.trim()) {
                  updateProfilePicture(newPhotoURL);
                  onClose();
                }
              }}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Update Picture
            </button>
          </div>
        );
      default:
        return <p className="text-gray-600">No content available.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 capitalize">{type}</h2>
        {renderContent()}
      </div>
    </div>
  );
}
