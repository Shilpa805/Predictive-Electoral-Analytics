import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createCustomIcon = (status) => {
  const isVerified = status === 'VERIFIED';
  return L.divIcon({
    className: 'custom-node-icon',
    html: `
      <div class="node-marker ${isVerified ? 'verified' : 'estimated'}">
        <div class="ring"></div>
        <div class="core"></div>
        <div class="label-tag">${isVerified ? 'TRK' : 'EST'}</div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function TrackingMap({ nodes }) {
  // New Delhi center roughly
  const defaultCenter = [28.6139, 77.2090];

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%', backgroundColor: '#0a0a0f' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {Object.values(nodes).map(node => (
          <Marker 
            key={node.nodeId} 
            position={[node.lat, node.lng]}
            icon={createCustomIcon(node.status)}
          >
            <Popup className="cyber-popup">
              <div className="popup-content">
                <div className="header">NODE: {node.nodeId}</div>
                <div className="row"><span>Status:</span> <span className={node.status.toLowerCase()}>{node.status}</span></div>
                <div className="row"><span>Lat:</span> <span>{node.lat.toFixed(5)}</span></div>
                <div className="row"><span>Lng:</span> <span>{node.lng.toFixed(5)}</span></div>
                <div className="row"><span>Battery:</span> <span>{node.battery}%</span></div>
                <div className="row"><span>Last Update:</span> <span>{new Date(node.timestamp).toLocaleTimeString()}</span></div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="map-overlay"></div>
    </div>
  );
}
