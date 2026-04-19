import React from 'react';
import { Activity, ShieldAlert, Wifi, Cpu, MapPin } from 'lucide-react';

export default function TelemetryDashboard({ nodes, rawDataLog }) {
  const nodeArray = Object.values(nodes);
  
  const verifiedCount = nodeArray.filter(n => n.status === 'VERIFIED').length;
  const estimatedCount = nodeArray.filter(n => n.status === 'ESTIMATED').length;

  return (
    <div className="telemetry-panel">
      <div className="panel-header">
        <h2><Activity className="icon pulse" /> LORA NETWORK UPLINK</h2>
        <div className="status-badge live">LIVE</div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-box">
          <span className="label">ACTIVE NODES</span>
          <span className="value">{nodeArray.length}</span>
        </div>
        <div className="metric-box">
          <span className="label">VERIFIED (T-0)</span>
          <span className="value text-cyan">{verifiedCount}</span>
        </div>
        <div className="metric-box warning-box">
          <span className="label">ESTIMATING</span>
          <span className="value text-yellow">{estimatedCount}</span>
        </div>
      </div>

      <div className="node-list">
        <h3><MapPin className="icon" /> ASSET TRACKING</h3>
        {nodeArray.map(node => (
          <div key={node.nodeId} className={`node-item ${node.status.toLowerCase()}`}>
            <div className="node-info">
              <span className="node-name">{node.nodeId}</span>
              <span className="coords">{node.lat.toFixed(4)}, {node.lng.toFixed(4)}</span>
            </div>
            <div className="node-status">
              {node.status === 'VERIFIED' ? <Wifi className="icon small" /> : <ShieldAlert className="icon small glitch" />}
              <span className="status-text">{node.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="terminal-feed">
        <h3><Cpu className="icon" /> RAW INGEST (JSON PARSER)</h3>
        <div className="log-container">
          {rawDataLog.map((log, i) => (
             <div key={i} className={`log-line ${log.isFragmented ? 'error' : 'success'}`}>
               <span className="timestamp">[{new Date().toLocaleTimeString()}]</span>
               <span className="code">{log.rawString}</span>
               {log.isFragmented && <span className="err-tag">PARSE_ERR ➜ EXTRAPOLATING</span>}
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
