// This engine processes the raw strings and maintains the historical buffer

export class PredictiveEngine {
  constructor() {
    this.historyBuffer = {}; // { nodeId: [ { lat, lng, time } ] }
    this.bufferSize = 5; // keep last 5 valid points to compute velocity
  }

  processPacket(rawString) {
    try {
      const packet = JSON.parse(rawString);
      // It's valid!
      this.updateBuffer(packet.nodeId, packet.payload.lat, packet.payload.lng, Date.now());
      return {
        nodeId: packet.nodeId,
        lat: packet.payload.lat,
        lng: packet.payload.lng,
        status: 'VERIFIED',
        battery: packet.payload.battery,
        timestamp: packet.timestamp
      };
    } catch (e) {
      // Packet is broken/fragmented
      // To perform a prediction, we need to extract the nodeId from the partial string.
      const idMatch = rawString.match(/"nodeId":"([^"]+)"/);
      if (idMatch && idMatch[1]) {
        const nodeId = idMatch[1];
        const estimatedState = this.predictNextState(nodeId);
        
        if (estimatedState) {
           return {
             nodeId: nodeId,
             lat: estimatedState.lat,
             lng: estimatedState.lng,
             status: 'ESTIMATED',
             battery: '---', // Unknown
             timestamp: new Date().toISOString()
           };
        } else {
           // We have no history, cannot estimate
           return null;
        }
      }
      return null;
    }
  }

  updateBuffer(nodeId, lat, lng, time) {
    if (!this.historyBuffer[nodeId]) {
      this.historyBuffer[nodeId] = [];
    }
    
    this.historyBuffer[nodeId].push({ lat, lng, time });
    
    if (this.historyBuffer[nodeId].length > this.bufferSize) {
      this.historyBuffer[nodeId].shift(); // Remove oldest
    }
  }

  predictNextState(nodeId) {
    const history = this.historyBuffer[nodeId];
    if (!history || history.length < 2) {
      return null; // Not enough data to compute velocity
    }

    // Basic Kinematic Extrapolation based on last two points
    const p1 = history[history.length - 2];
    const p2 = history[history.length - 1];

    const dt = p2.time - p1.time;
    if (dt === 0) return { lat: p2.lat, lng: p2.lng }; // Avoid div by zero

    const vLat = (p2.lat - p1.lat) / dt;
    const vLng = (p2.lng - p1.lng) / dt;

    // Estimate position assuming same delay (~2000ms loosely as per simulator)
    const assumedDt = 2000;
    
    const estLat = p2.lat + (vLat * assumedDt);
    const estLng = p2.lng + (vLng * assumedDt);

    // Update buffer with prediction so sequence of bad packets continues moving!
    this.updateBuffer(nodeId, estLat, estLng, p2.time + assumedDt);

    return { lat: estLat, lng: estLng };
  }
}
