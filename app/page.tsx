"use client";
import React, { useEffect, useState } from "react";
import { database } from "../lib/firebaseConfig";
import { ref, onValue, set } from "firebase/database";

type SensorCardProps = {
  label: string;
  value: number;
  unit: string;
  color: "blue" | "red" | "green" | "yellow" | "purple";
};

const SensorCard = ({ label, value, unit, color }: SensorCardProps) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <div className={`p-4 rounded-xl shadow-md text-center ${colorClasses[color]}`}>
      <div className="text-xl font-bold">{label}</div>
      <div className="text-3xl mt-2">
        {value}
        {unit}
      </div>
    </div>
  );
};

export default function Home() {
  // Hooks – these must always be called in the same order!
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [moisture, setMoisture] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [relay, setRelay] = useState(false);
  const [mode, setMode] = useState("manual");
  const [online, setOnline] = useState(false);

  // Password logic
  const correctPassword = "fot008";
  const handleLogin = () => {
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  // Firebase data
  useEffect(() => {
    if (!authenticated) return;
    const now = Date.now();

    onValue(ref(database, "moisture"), (snap) => setMoisture(snap.val()));
    onValue(ref(database, "humidity"), (snap) => setHumidity(snap.val()));
    onValue(ref(database, "temperature"), (snap) => setTemperature(snap.val()));
    onValue(ref(database, "relay"), (snap) => setRelay(snap.val()));
    onValue(ref(database, "mode"), (snap) => setMode(snap.val()));
    onValue(ref(database, "lastOnline"), (snap) => {
      const diff = now - snap.val();
      setOnline(diff < 10000);
    });
  }, [authenticated]);

  const toggleRelay = () => {
    if (mode === "manual") {
      set(ref(database, "relay"), !relay);
    }
  };

  const toggleMode = () => {
    set(ref(database, "mode"), mode === "manual" ? "auto" : "manual");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md space-y-4 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-green-700">WELCOME IRRIGATION SYSTEM</h1>
          <h2 className="font-semibold">Enter Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-700">Irrigation System</h1>

        {/* Online Status */}
        <div className="flex justify-center items-center gap-2 text-sm">
          <span
            className={`h-3 w-3 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`}
          ></span>
          <span className="text-gray-600">{online ? "Online" : "Offline"}</span>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SensorCard label="Moisture" value={moisture} unit="" color="blue" />
          <SensorCard label="Temperature" value={temperature} unit="°C" color="red" />
          <SensorCard label="Humidity" value={humidity} unit="%" color="green" />
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-700">Mode: {mode.toUpperCase()}</p>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={mode === "auto"}
              onChange={toggleMode}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></span>
          </label>
        </div>

        {/* Relay Button */}
        <button
          onClick={toggleRelay}
          disabled={mode !== "manual"}
          className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-all ${
            mode !== "manual"
              ? "bg-gray-400 cursor-not-allowed"
              : relay
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {relay ? "Turn OFF Pump" : "Turn ON Pump"}
        </button>
      </div>
    </div>
  );
}
