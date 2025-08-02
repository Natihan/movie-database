import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import RecentActivity from "../components/RecentActivity";
import { Link } from "react-router-dom";
import ProfileQuickAccessModal from "../components/ProfileQuickAccessModal";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <img
          src={
            user?.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=0D8ABC&color=fff&rounded=true`
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{user?.username || "Username"}</h1>
          <p className="text-gray-600 mt-1">Welcome to your MovieDB dashboard.</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <ProfileCard
          title="Reviews"
          text="See and manage your movie reviews."
          colorClasses="bg-blue-50 border-blue-500 text-blue-700"
          onClick={() => openModal("reviews")}
        />
        <ProfileCard
          title="Liked Movies"
          text="Check your recently liked content."
          colorClasses="bg-green-50 border-green-500 text-green-700"
          onClick={() => openModal("likes")}
        />
        <ProfileCard
          title="Watchlist"
          text="Manage your saved movies & shows."
          colorClasses="bg-purple-50 border-purple-500 text-purple-700"
          onClick={() => openModal("watchlist")}
        />
        <ProfileCard
          title="Favorites"
          text="Your all-time favorite movies."
          colorClasses="bg-rose-50 border-rose-500 text-rose-700"
          onClick={() => openModal("favorites")}
        />
        <ProfileCard
          title="Settings"
          text="Update your profile and preferences."
          colorClasses="bg-yellow-50 border-yellow-500 text-yellow-700"
          onClick={() => openModal("settings")}
        />
        <ProfileCard
          title="Back to Home"
          text="Return to homepage."
          colorClasses="bg-gray-100 border-gray-400 text-gray-700"
          link="/"
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <RecentActivity />
      </div>

      {/* Modal */}
      <ProfileQuickAccessModal type={activeModal} isOpen={!!activeModal} onClose={closeModal} />
    </div>
  );
}

function ProfileCard({ title, text, link, onClick, colorClasses }) {
  return (
    <div className={`border-l-4 rounded p-5 shadow hover:shadow-md transition ${colorClasses}`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600 text-sm mt-1">{text}</p>
      {link ? (
        <Link
          to={link}
          className="text-sm mt-3 inline-block font-medium underline underline-offset-4 hover:text-black"
        >
          Go →
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="text-sm mt-3 inline-block font-medium underline underline-offset-4 hover:text-black"
        >
          Go →
        </button>
      )}
    </div>
  );
}
