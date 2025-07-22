// src/components/TrendingTabs.jsx
import { useState } from "react";

export default function TrendingTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-4 mb-6">
      {["Today", "This Week"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full border ${
            activeTab === tab ? "bg-[#032541] text-white" : "bg-white text-[#032541]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
