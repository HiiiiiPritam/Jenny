"use client";
import { useState, useEffect } from "react";

export default function RealGirlfriendToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetch("/api/user/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.isRealGirlfriendMode !== undefined) {
          setEnabled(data.isRealGirlfriendMode);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch settings", err);
        setLoading(false);
      });
  }, []);

  const toggleMode = async () => {
    const newState = !enabled;
    setEnabled(newState);
    try {
      await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRealGirlfriendMode: newState }),
      });
    } catch (err) {
      console.error("Failed to update settings", err);
      setEnabled(!newState); // Revert on error
    }
  };

  const simulateProactive = async () => {
    setSimulating(true);
    try {
      const res = await fetch("/api/cron/proactive?force=true");
      const data = await res.json();
      alert(`Simulation complete! Messages sent: ${data.messagesSent}`);
    } catch (err) {
      alert("Simulation failed");
    } finally {
      setSimulating(false);
    }
  };

  if (loading) return <div className="text-gray-400 text-xs">Loading...</div>;

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-pink-500/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-pink-400">Real Girlfriend Mode</span>
        <button
          onClick={toggleMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            enabled ? "bg-pink-600" : "bg-gray-600"
          }`}
        >
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        Enables proactive messages and realistic interactions.
      </p>
      
      {enabled && (
        <button
          onClick={simulateProactive}
          disabled={simulating}
          className="w-full py-1 px-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
        >
          {simulating ? "Simulating..." : "Test Trigger (Dev)"}
        </button>
      )}
    </div>
  );
}
