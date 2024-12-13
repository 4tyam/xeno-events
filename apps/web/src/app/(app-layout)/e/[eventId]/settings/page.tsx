"use client";

import { useState } from "react";
import Overview from "./components/Overview";
import Attendees from "./components/Attendees";
import Analytics from "./components/Analytics";
import More from "./components/More";
import { LayoutDashboard, Users, LineChart, Settings } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const buttons = [
    {
      id: "overview",
      label: "Overview",
      component: Overview,
      icon: LayoutDashboard,
    },
    { id: "attendees", label: "Attendees", component: Attendees, icon: Users },
    {
      id: "analytics",
      label: "Analytics",
      component: Analytics,
      icon: LineChart,
    },
    { id: "more", label: "More", component: More, icon: Settings },
  ];

  const ActiveComponent =
    buttons.find((button) => button.id === activeTab)?.component || Overview;

  return (
    <div className="space-y-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Event Settings
        </h2>
      </div>

      {/* Navigation Menu */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth">
          {buttons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveTab(button.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 font-medium
                ${
                  activeTab === button.id
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <button.icon className="w-4 h-4" />
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <ActiveComponent />
    </div>
  );
}
