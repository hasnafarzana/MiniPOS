import React, { useState, useEffect } from 'react';

function HealthStatus() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error('Failed to fetch health status');
      }
      const data = await response.json();
      setHealth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return <div className="health-status loading">Loading health status...</div>;
  }

  if (error) {
    return (
      <div className="health-status error">
        <p>Error: {error}</p>
        <button onClick={fetchHealth}>Retry</button>
      </div>
    );
  }

  return (
    <div className="health-status success">
      <h2>API Health Status</h2>
      <div className="health-details">
        <p><strong>Status:</strong> {health.status}</p>
        <p><strong>Timestamp:</strong> {health.timestamp}</p>
        <p><strong>Uptime:</strong> {health.uptime.toFixed(2)} seconds</p>
      </div>
      <button onClick={fetchHealth}>Refresh</button>
    </div>
  );
}

export default HealthStatus;
