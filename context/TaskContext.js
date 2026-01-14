"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/tasks", { credentials: "include" });
      const data = await res.json();
        // console.log("Fetched tasks data:", data);
      if (data.success) {
        setTasks(data.data);
      } else {
        console.warn("Failed to fetch tasks:", data.message);
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchTasks();
    }
  }, [user, authLoading]);

  return (
    <TaskContext.Provider value={{ tasks, loading, refetch: fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
