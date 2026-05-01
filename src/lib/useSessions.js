import { useState, useEffect } from "react";
import { loadSessions } from "./sheetLoader";

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessions()
      .then(data => {
        setSessions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load sessions:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { sessions, loading, error };
}
