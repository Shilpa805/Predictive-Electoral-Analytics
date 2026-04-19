import React, { useEffect, useState, useRef } from 'react';
import { LoRaSimulator } from './lib/loraSimulator';
import { PredictiveEngine } from './lib/predictiveEngine';
import TrackingMap from './components/TrackingMap';
import TelemetryDashboard from './components/TelemetryDashboard';

function App() {
  const [nodes, setNodes] = useState({});
  const [logFeed, setLogFeed] = useState([]);
  
  const simulatorRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    // Initialize simulation & prediction engine
    engineRef.current = new PredictiveEngine();
    simulatorRef.current = new LoRaSimulator(2500, 4); // 2.5s interval, 4 nodes

    simulatorRef.current.start((data) => {
      // 1. Log the raw data into our visual terminal
      setLogFeed(prev => {
        const newLog = [...prev, data];
        if (newLog.length > 10) newLog.shift();
        return newLog;
      });

      // 2. Pass string to predictive middleware
      const processed = engineRef.current.processPacket(data.rawString);

      // 3. Update the map nodes state
      if (processed) {
        setNodes(prev => ({
          ...prev,
          [processed.nodeId]: processed
        }));
      }
    });

    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="app-container">
      <TelemetryDashboard nodes={nodes} rawDataLog={logFeed} />
      <div className="map-section">
        <TrackingMap nodes={nodes} />
      </div>
    </div>
  );
}

export default App;
